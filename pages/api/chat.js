export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Incoming request:', JSON.stringify(req.body, null, 2));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "sk-ant-api03-placeholder-key-here"
      },
      body: JSON.stringify(req.body)
    });

    console.log('Claude API response status:', response.status);
    console.log('Claude API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error response:', errorText);
      
      return res.status(response.status).json({ 
        error: 'Claude API failed',
        status: response.status,
        details: errorText,
        debug: {
          requestBody: req.body,
          headers: response.headers
        }
      });
    }

    const data = await response.json();
    console.log('Claude API success response:', JSON.stringify(data, null, 2));
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      stack: error.stack
    });
  }
}
