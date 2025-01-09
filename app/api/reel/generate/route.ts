import { NextResponse } from 'next/server';
import { generateReelContent } from '../../services/geminiService';
import { synthesizeSpeech } from '../../services/pollyService';
import { searchPexelsVideos } from '../../services/pexelsService';
import { searchFreesoundMusic } from '../../services/freesoundService';
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
    const clipsWithAudioAndVideo = await Promise.all(
      result.content.clips.map(async (clip) => {
        try {
          // Generate voice audio
          const audioBase64 = await synthesizeSpeech(clip.text);
          
          // Fetch video for the clip
          const searchQuery = clip.videoKeywords.join(' ');
          let videoResponse = await searchPexelsVideos(searchQuery);
          
          // Fallback to generic video if no results
          if (videoResponse.videos.length === 0) {
            videoResponse = await searchPexelsVideos('people lifestyle');
          }

          const selectedVideo = videoResponse.videos[0];
          const bestQualityVideo = selectedVideo.video_files
            .filter(file => file.width >= 720 && file.height >= 1280)
            .sort((a, b) => (b.height * b.width) - (a.height * a.width))[0];

          return {
            ...clip,
            voiceAudio: `data:audio/mp3;base64,${audioBase64}`,
            video: {
              id: selectedVideo.id,
              url: bestQualityVideo.link,
              duration: selectedVideo.duration,
            },
          };
        } catch (error) {
          console.error('Failed to generate voice/video for clip:', error);
          return clip;
        }
      })
    );

    // Fetch background music if requested
    let bgMusicUrl = null;
    if (body.includeBgMusicCategory && result.content.bgMusicCategory) {
      try {
        const musicResponse = await searchFreesoundMusic(result.content.bgMusicCategory);
        if (musicResponse.results.length > 0) {
          bgMusicUrl = musicResponse.results[0].previews['preview-hq-mp3'];
        }
      } catch (error) {
        console.error('Failed to fetch background music:', error);
      }
    }

    // Update the content with voice audio, videos and background music
    const contentWithAllData = {
      ...result.content,
      clips: clipsWithAudioAndVideo,
      bgMusicUrl,
    };

    // Return successful response
    return NextResponse.json({ content: contentWithAllData });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 