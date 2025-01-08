// Component for the initial prompt input page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type GenerateReelContentResponse, type ReelContent } from '@/app/types/api';
import { searchPexelsVideos } from '@/app/api/services/pexelsService';
import { searchFreesoundMusic } from '@/app/api/services/freesoundService';
import { AuroraBackground } from './ui/aurora-background';
import { motion } from 'framer-motion';

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
        includeBgMusicCategory: true // Request background music category
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
          // Join keywords with spaces and use the first one as fallback
          const searchQuery = clip.videoKeywords.join(' ');
          const fallbackQuery = clip.videoKeywords[0];
          
          // Try with combined keywords first
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
      // Generate reel content
      const { content, error } = await generateReelContent(prompt.trim());
      if (error || !content) throw new Error(error || 'Failed to generate content');

      // Fetch videos for each clip
      const contentWithVideos = await fetchVideosForClips(content);

      // Fetch background music based on the suggested category
      const bgMusicUrl = await fetchBgMusic(content.bgMusicCategory);

      // Create initial state with default voice and background music
      const initialState = {
        ...contentWithVideos,
        voiceSettings: {
          voiceId: 'Joey',
          engine: 'neural'
        },
        bgMusic: bgMusicUrl
      };

      // Store the complete content in localStorage for the editor page
      localStorage.setItem('reelContent', JSON.stringify(initialState));

      // Call onSubmit if provided
      if (onSubmit) onSubmit(prompt.trim());

      // Redirect to editor page
      // router.push('/editor');
    } catch (error) {
      console.error('Error generating reel:', error);
      alert('Failed to generate reel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
       <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
     <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg p-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Create Your AI Reel
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              What would you like your reel to be about?
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your reel topic or description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:opacity-50"
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? 'Generating Reel...' : 'Create Reel'}
          </button>
        </form>
      </div>
    </div>
    </motion.div>
    </AuroraBackground>
  );
} 