export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // DEBUG: Check if API key exists
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));
  
  try {
    // ... rest of your code stays the same
