import { searchPexelsVideos } from '@/app/api/services/pexelsService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const videoResults = await searchPexelsVideos(query);
    return NextResponse.json(videoResults);
  } catch (error) {
    console.error('Error searching videos:', error);
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    );
  }
} 