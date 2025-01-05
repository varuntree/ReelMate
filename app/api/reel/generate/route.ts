import { NextResponse } from 'next/server';
import { generateReelContent } from '../../services/geminiService';
import { type GenerateReelContentRequest } from '@/app/types/api';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = (await request.json()) as GenerateReelContentRequest;

    // Validate request
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate reel content
    const result = await generateReelContent(body);

    // Check for errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error, content: result.content },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 