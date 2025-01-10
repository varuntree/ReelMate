import { searchFreesoundMusic } from '@/app/api/services/freesoundService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { category } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const musicResults = await searchFreesoundMusic(category);
    return NextResponse.json(musicResults);
  } catch (error) {
    console.error('Error searching music:', error);
    
    // Check if error is due to missing API key
    if (error instanceof Error && error.message === 'Freesound API key is not configured') {
      return NextResponse.json(
        { error: 'Freesound API key is not configured. Please set NEXT_PUBLIC_FREESOUND_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search music. Please try again later.' },
      { status: 500 }
    );
  }
} 