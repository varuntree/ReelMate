'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { type GenerateReelContentResponse, type ReelContent } from '@/app/types/api';
import { searchPexelsVideos } from '@/app/api/services/pexelsService';
import { searchFreesoundMusic } from '@/app/api/services/freesoundService';

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
          let videoResponse = await searchPexelsVideos(searchQuery);
          if (videoResponse.videos.length === 0) {
            videoResponse = await searchPexelsVideos('people lifestyle');
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

      // Redirect to editor page - Commented out as per original code
      // router.push('/editor');
    } catch (error) {
      console.error('Error generating reel:', error);
      alert('Failed to generate reel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.05] bg-grid-black/[0.05] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400">
            Create Your AI Reel
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your reel topic or description..."
                className="block w-full h-14 px-4 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white transition-colors placeholder:text-neutral-600 dark:placeholder:text-neutral-400"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <motion.button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 rounded-lg bg-gradient-to-b from-black to-neutral-800 dark:from-white dark:to-neutral-200 text-white dark:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Reel...' : 'Create Reel'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}