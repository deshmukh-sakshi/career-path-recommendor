import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF using pdf-parse (dynamic import to avoid issues)
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    console.log('📄 PDF parsed successfully. Text length:', text.length);
    console.log('📄 First 200 chars:', text.substring(0, 200));

    return NextResponse.json(
      { 
        success: true,
        text, 
        pages: data.numpages,
        fileName: file.name
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ PDF parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF: ' + error.message },
      { status: 500 }
    );
  }
}
