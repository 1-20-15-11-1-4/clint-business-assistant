export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API call received:', req.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      
      // Return a helpful error message
      return res.status(500).json({ 
        error: 'API call failed',
        details: `Status: ${response.status}`,
        fallbackResponse: {
          content: [{
            text: "I'd be happy to help you with that insurance task! As Clint's business assistant, I can help with forms, customer information, policy management, and daily administrative tasks. What specific task would you like me to assist you with today?"
          }]
        }
      });
    }

    const data = await response.json();
    console.log('Claude API success:', data);
    res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    
    // Return fallback response for demo
    res.status(200).json({
      content: [{
        text: "I'd be happy to help you with that! As Clint's business assistant for AIP Best Rate, I can assist with insurance forms, customer data, policy management, and administrative tasks. What would you like me to help you with today?"
      }]
    });
  }
}
