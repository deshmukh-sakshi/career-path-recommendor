import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/gemini';
import { db } from '@/lib/db';
import { resumes, skills } from '@/lib/db/schema';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, userId } = body;

    if (!text || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Clean text to remove invalid characters
    const cleanText = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/[^\x20-\x7E\s]/g, '') // Keep only printable ASCII and whitespace
      .substring(0, 5000); // Limit length

    // Parse resume with Gemini
    console.log('Parsing resume with Gemini...');
    const parsedData = await parseResume(cleanText);
    console.log('Parsing complete:', parsedData);

    // Store resume in database
    const [resume] = await db
      .insert(resumes)
      .values({
        userId,
        rawText: cleanText,
        parsedData,
        confidence: parsedData.parsingConfidence || 0.9,
        isActive: true,
      })
      .returning();

    // Store extracted skills
    const technicalSkills = parsedData.skills?.technical || [];
    const softSkills = parsedData.skills?.soft || [];
    const tools = parsedData.skills?.tools || [];

    const skillsToInsert = [
      ...technicalSkills.map((skill: any) => ({
        userId,
        name: skill.name,
        category: 'technical',
        level: skill.level,
        verified: true,
        source: 'resume',
      })),
      ...softSkills.map((skill: any) => ({
        userId,
        name: skill.name,
        category: 'soft',
        level: skill.level,
        verified: true,
        source: 'resume',
      })),
      ...tools.map((tool: any) => ({
        userId,
        name: tool.name,
        category: 'technical',
        level: tool.level || 70,
        verified: true,
        source: 'resume',
      })),
    ];

    if (skillsToInsert.length > 0) {
      await db.insert(skills).values(skillsToInsert);
    }

    return NextResponse.json(
      {
        success: true,
        resume: {
          id: resume.id,
          confidence: resume.confidence,
        },
        parsedData,
        skillsExtracted: skillsToInsert.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse resume',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
