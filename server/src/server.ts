import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config();

let isConnected = false;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB Connected");
    }

    return app(req as any, res as any);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}