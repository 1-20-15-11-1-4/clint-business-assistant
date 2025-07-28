export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Check if API key exists
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));

  try {
    console.log('Incoming request:', JSON.stringify(req.body, null, 2));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: req.body.messages || [
          {
            role: "system",
            content: "You are Clint's professional business assistant for AIP Best Rate insurance company. Help with insurance forms, customer management, and daily business tasks."
          },
          {
            role: "user", 
            content: req.body.message || "Hello"
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      
      return res.status(response.status).json({ 
        error: 'OpenAI API failed',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('OpenAI API success!');
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message
    });
  }
}
