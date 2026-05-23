import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey || '' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory, userContext } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Build system prompt with context
    const systemPrompt = `You are an expert AI Career Assistant specializing in:
1. Resume optimization and improvement suggestions
2. Technical interview preparation
3. Career guidance for software engineers
4. Skill development recommendations
5. Job search strategies for the Indian tech market

${userContext?.skills ? `User's Skills: ${userContext.skills.join(', ')}` : ''}
${userContext?.careerGoals ? `Career Goals: ${userContext.careerGoals.join(', ')}` : ''}
${userContext?.experience ? `Experience Level: ${userContext.experience}` : ''}

Guidelines:
- Be concise and actionable
- Provide specific, practical advice
- Use Indian market context (INR salaries, Indian companies)
- For resume suggestions, be specific about what to add/remove/improve
- For technical queries, provide clear explanations with examples
- Be encouraging and supportive

Format your responses clearly with bullet points or numbered lists when appropriate.`;

    // Build messages array
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call Groq API
    const response = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      stream: false,
    });

    const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    console.log('✅ AI Assistant response generated');

    return NextResponse.json(
      {
        message: assistantMessage,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ AI Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
