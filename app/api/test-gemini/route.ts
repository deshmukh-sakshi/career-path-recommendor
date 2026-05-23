import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const result = await model.generateContent('Say hello in one sentence');
    const response = result.response.text();
    
    return NextResponse.json({ 
      success: true, 
      message: response,
      apiKeyPrefix: apiKey.substring(0, 10) + '...'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}
