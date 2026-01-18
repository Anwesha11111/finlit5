import { NextRequest, NextResponse } from 'next/server'; // Vercel 2026

const express = await import('express');
const mongoose = await import('mongoose');
const cors = await import('cors');

export async function POST(request) {
  const app = express();
  app.use(await cors());
  app.use(express.json());
  
  mongoose.default.connect(process.env.MONGO_URI, { dbName: 'finlit_bot' });
  
  const { message } = await request.json();
  const aiRes = await fetch(`${process.env.AI_SERVICE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  }).then(r => r.json());
  
  return NextResponse.json(aiRes);
}

export async function GET() {
  return NextResponse.json({ chats: [] }); // Placeholder
}

export const runtime = 'nodejs'; // Vercel 2026 required
