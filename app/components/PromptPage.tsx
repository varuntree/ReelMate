
// Component for the initial prompt input page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type GenerateReelContentResponse, type ReelContent } from '@/app/types/api';
import { searchPexelsVideos } from '@/app/api/services/pexelsService';
import { searchFreesoundMusic } from '@/app/api/services/freesoundService';
import { AuroraBackground } from './ui/aurora-background';

interface PromptPageProps {
  onSubmit?: (prompt: string) => void;
}

export default function PromptPage({ onSubmit }: PromptPageProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const generateReelContent = async (prompt: string) => {
    const response = await fetch('/api/reel/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt,
        includeBgMusicCategory: true
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate reel content');
    }
    
    return await response.json() as GenerateReelContentResponse;
  };

  const fetchVideosForClips = async (content: ReelContent) => {
    const updatedClips = await Promise.all(
      content.clips.map(async (clip) => {
        try {
          const searchQuery = clip.videoKeywords.join(' ');
          let videoResponse = await searchPexelsVideos(searchQuery);
          if (videoResponse.videos.length === 0) {
            const fallbackQuery = 'people lifestyle';
            videoResponse = await searchPexelsVideos(fallbackQuery);
          }

          const selectedVideo = videoResponse.videos[0];
          const bestQualityVideo = selectedVideo.video_files
            .filter(file => file.width >= 720 && file.height >= 1280)
            .sort((a, b) => (b.height * b.width) - (a.height * a.width))[0];

          return {
            ...clip,
            video: {
              id: selectedVideo.id,
              url: bestQualityVideo.link,
              duration: selectedVideo.duration,
            },
          };
        } catch (error) {
          console.error('Failed to fetch video for clip:', error);
          return clip;
        }
      })
    );

    return { ...content, clips: updatedClips };
  };

  const fetchBgMusic = async (category: string) => {
    try {
      const response = await searchFreesoundMusic(category);
      if (response.results.length > 0) {
        return response.results[0].previews['preview-hq-mp3'];
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch background music:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const { content, error } = await generateReelContent(prompt.trim());
      if (error || !content) throw new Error(error || 'Failed to generate content');

      const contentWithVideos = await fetchVideosForClips(content);
      const bgMusicUrl = await fetchBgMusic(content.bgMusicCategory);

      const initialState = {
        ...contentWithVideos,
        voiceSettings: {
          voiceId: 'Joey',
          engine: 'neural'
        },
        bgMusic: bgMusicUrl
      };

      localStorage.setItem('reelContent', JSON.stringify(initialState));

      if (onSubmit) onSubmit(prompt.trim());

    } catch (error) {
      console.error('Error generating reel:', error);
      alert('Failed to generate reel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground className="relative">
      <div className="w-full max-w-2xl mx-auto p-8 relative z-10">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-300">
            Create Your AI Reel
          </h1>
          <p className="text-neutral-300">
            Transform your ideas into engaging video content
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-neutral-200"
            >
              What would you like your reel to be about?
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 backdrop-blur-sm p-4 text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500 transition-all"
              placeholder="Enter your reel topic or description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 px-5 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-700 backdrop-blur-sm"
          >
            {isLoading ? 'Generating Reel...' : 'Create Reel'}
          </button>
        </form>
      </div>
    </AuroraBackground>
  );
}
