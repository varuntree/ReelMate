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
    return NextResponse.json(
      { error: 'Failed to search music' },
      { status: 500 }
    );
  }
} 