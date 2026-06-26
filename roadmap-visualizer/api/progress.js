export default async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(200).json({ warning: 'Vercel KV is not configured.', data: {} });
  }

  if (req.method === 'GET') {
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
          // If it's already an object (Vercel KV sometimes auto-parses)
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
      const response = await fetch(`${kvUrl}/set/roboPet_progress`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
        body: JSON.stringify(req.body),
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save to KV' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
