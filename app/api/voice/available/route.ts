import { AVAILABLE_VOICES } from '@/app/api/services/pollyService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(AVAILABLE_VOICES);
  } catch (error) {
    console.error('Error getting available voices:', error);
    return NextResponse.json(
      { error: 'Failed to get available voices' },
      { status: 500 }
    );
  }
} 