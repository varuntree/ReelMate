import { NextResponse } from 'next/server';
import { generateReelContent } from '../../services/geminiService';
import { synthesizeSpeech } from '../../services/pollyService';
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

    // Generate voice audio for each clip with Joey voice
    const clipsWithAudio = await Promise.all(
      result.content.clips.map(async (clip) => {
        try {
          const audioBase64 = await synthesizeSpeech(clip.text);
          return {
            ...clip,
            voiceAudio: `data:audio/mp3;base64,${audioBase64}`, // Format as data URL
          };
        } catch (error) {
          console.error('Failed to generate voice for clip:', error);
          return clip; // Return clip without audio if generation fails
        }
      })
    );

    // Update the content with voice audio
    const contentWithAudio = {
      ...result.content,
      clips: clipsWithAudio,
    };

    // Return successful response
    return NextResponse.json({ content: contentWithAudio });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 