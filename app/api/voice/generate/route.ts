import { NextResponse } from 'next/server';
import { synthesizeSpeech } from '../../services/pollyService';

export async function POST(request: Request) {
  try {
    const { text, voiceSettings } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const audioBase64 = await synthesizeSpeech(text, voiceSettings);

    return NextResponse.json({ audioBase64 });
  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
} 