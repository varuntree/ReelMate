// Component for the initial prompt input page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type GenerateReelContentResponse, type ReelContent } from '@/app/types/api';
import { searchPexelsVideos } from '@/app/api/services/pexelsService';
import { searchFreesoundMusic } from '@/app/api/services/freesoundService';
import { HeroHighlight, Highlight } from './ui/hero-highlight';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { MultiStepLoader } from './ui/multi-step-loader';
import { IconSquareRoundedX } from "@tabler/icons-react";

interface PromptPageProps {
  onSubmit?: (prompt: string) => void;
}

export default function PromptPage({ onSubmit }: PromptPageProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loadingStates = [
    { text: "Analyzing your creative prompt..." },
    { text: "Crafting an engaging storyline..." },
    { text: "Generating AI-powered script..." },
    { text: "Finding perfect video clips..." },
    { text: "Creating professional voice-over..." },
    { text: "Adding background ambiance..." },
    { text: "Assembling your masterpiece..." },
    { text: "Finalizing your viral reel..." }
  ];

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
    <HeroHighlight className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-text">
              Instant Reel Creation & Automatic Publishing: Boost Your Revenue with Zero Effort. Our AI Does the Heavy Lifting for You
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-300">
            Effortlessly Increase Engagement and Earnings with Our Auto-Publishing Reel Technology.
          </p>
        </div>

        <div className="w-full max-w-lg mt-8">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Create a reel about healthy lifestyle tips...",
              "Generate a reel about digital marketing strategies...",
              "Make a reel about travel destinations...",
              "Design a reel about cooking recipes...",
            ]}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={handleSubmit}
          />
          <button 
            onClick={handleSubmit}
            disabled={prompt.length < 5}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mt-4 w-full  disabled:cursor-not-allowed"
          >
            <span className="absolute inset-[-1000%]  animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#608ce0_0%,#98b3d5_50%,#608ce0_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-primary px-3 py-1 text-lg font-medium text-text backdrop-blur-3xl">
              {isLoading ? 'Generating...' : 'Generate Reel'}
            </span>
          </button>

          <MultiStepLoader
            loadingStates={loadingStates}
            loading={isLoading}
            duration={2000}
            loop={false}
          />

          {isLoading && (
            <button
              className="fixed top-4 right-4 text-black dark:text-white z-[120]"
              onClick={() => setIsLoading(false)}
            >
              <IconSquareRoundedX className="h-10 w-10" />
            </button>
          )}
        </div>
      </div>
    </HeroHighlight>
  );
} 