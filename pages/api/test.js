export default async function handler(req, res) {
  return res.status(200).json({
    hasApiKey: !!process.env.OPENAI_API_KEY,
    keyStartsWithSk: process.env.OPENAI_API_KEY?.startsWith('sk-'),
    keyLength: process.env.OPENAI_API_KEY?.length || 0
  });
}
