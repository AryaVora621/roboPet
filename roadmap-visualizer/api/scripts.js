export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password, action, file } = req.body;
    
    // Authenticate
    const correctPassword = process.env.SYNC_PASSWORD;
    if (correctPassword && password !== correctPassword) {
      return res.status(401).json({ error: 'Unauthorized: Incorrect admin password.' });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return res.status(500).json({ error: 'GitHub token not configured.' });
    }

    const owner = 'AryaVora621';
    const repo = 'roboPet';

    try {
      if (action === 'list') {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/shortform_scripts`;
        const getRes = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!getRes.ok) return res.status(getRes.status).json({ error: 'Failed to fetch scripts list' });
        
        const data = await getRes.json();
        const files = data.filter(item => item.name.endsWith('.md')).map(item => item.name);
        return res.status(200).json({ files });
      } 
      
      if (action === 'read' && file) {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/shortform_scripts/${file}`;
        const getRes = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!getRes.ok) return res.status(getRes.status).json({ error: 'Failed to fetch file content' });
        
        const data = await getRes.json();
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return res.status(200).json({ content });
      }
      
      return res.status(400).json({ error: 'Invalid action' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
