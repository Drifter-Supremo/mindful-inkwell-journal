import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Return all environment variables (except sensitive ones)
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_REGION: process.env.VERCEL_REGION,
    // Check if DeepSeek API key exists (don't return the actual key)
    DEEPSEEK_API_KEY_EXISTS: !!process.env.DEEPSEEK_API_KEY,
    VITE_DEEPSEEK_API_KEY_EXISTS: !!process.env.VITE_DEEPSEEK_API_KEY,
  };

  return res.status(200).json({
    message: 'Debug information',
    environment: envVars,
    headers: req.headers,
    method: req.method,
    url: req.url,
  });
}
