import app from '../src/app.js';
import connectDB from '../src/app/lib/db.js';

// Serverless Handler for Vercel / Cloud Functions
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
