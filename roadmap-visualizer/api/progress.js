export default async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (req.method === 'GET') {
    if (!kvUrl || !kvToken) {
      return res.status(200).json({ warning: 'Vercel KV is not configured.', data: {} });
    }
    try {
      const response = await fetch(`${kvUrl}/get/roboPet_progress`, {
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
      });
      const result = await response.json();
      
      let data = {};
      if (result.result) {
        try {
          data = JSON.parse(result.result);
        } catch (e) {
          data = result.result;
        }
      }
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch from KV' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { progressObj, tasks } = req.body;

      // 1. Save to KV
      if (kvUrl && kvToken) {
        await fetch(`${kvUrl}/set/roboPet_progress`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
          },
          body: JSON.stringify(progressObj),
        });
      }

      // 2. Save to GitHub README if token is present
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken && tasks) {
        const owner = 'AryaVora621'; // The github username
        const repo = 'roboPet';
        const path = 'README.md';
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

        const getRes = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (getRes.ok) {
          const data = await getRes.json();
          let content = Buffer.from(data.content, 'base64').toString('utf-8');
          const originalContent = content;

          // Replace checkboxes based on task status
          tasks.forEach(t => {
            // First uncheck it just in case
            content = content.split(`- [x] ${t.text}`).join(`- [ ] ${t.text}`);
            
            // Check it if it is completed
            if (t.completed) {
              content = content.split(`- [ ] ${t.text}`).join(`- [x] ${t.text}`);
            }
          });

          // Only commit if changed
          if (content !== originalContent) {
            await fetch(url, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: 'Update roadmap progress in README',
                content: Buffer.from(content).toString('base64'),
                sha: data.sha
              })
            });
          }
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save progress' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
