import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import connectDB from "../src/config/db";

dotenv.config();

let connected = false;

async function ensureDbConnection() {
  if (!connected) {
    await connectDB();
    connected = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDbConnection();
  return app(req, res);
}
