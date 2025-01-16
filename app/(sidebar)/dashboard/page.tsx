'use client';

import { useState, useEffect } from 'react';
import PromptPage from '@/app/app-components/PromptPage';
import MainEditorPage from '@/app/app-components/MainEditorPage';
import Navbar from '@/app/app-components/Navbar';
import { type ReelTheme, type TextClip, type ReelContent } from '@/app/types/api';
import { Engine } from '@aws-sdk/client-polly';

// Define the main reel state interface
export interface ReelState {
  prompt: string;
  selectedVideo: string | null;
  script: string;
  voiceSettings: {
    voiceId: string;
    engine: Engine;
  };
  bgMusic: string | null;
  bgMusicKeywords?: string[]; // Keywords for background music search
  style?: {
    tone: string;
    pacing: 'slow' | 'medium' | 'fast';
  };
  clips: TextClip[];
  showText: boolean;
  textStyle: {
    fontWeight: 'normal' | 'bold';
    color: string;
    underline: boolean;
    size: 'small' | 'medium' | 'large';
    align: 'left' | 'center' | 'right';
    decoration: 'none' | 'shadow1' | 'shadow2' | 'shadow3' | 'shadow4';
    fontFamily: string;
  };
  savedTemplates: Array<{
    id: string;
    name: string;
    style: {
      fontWeight: 'normal' | 'bold';
      color: string;
      underline: boolean;
      size: 'small' | 'medium' | 'large';
      align: 'left' | 'center' | 'right';
      decoration: 'none' | 'shadow1' | 'shadow2' | 'shadow3' | 'shadow4';
      fontFamily: string;
    };
  }>;
  transition: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'blur';
}

const defaultReelState: ReelState = {
  prompt: '',
  selectedVideo: null,
  script: '',
  voiceSettings: {
    voiceId: 'Joanna',
    engine: 'neural',
  },
  bgMusic: null,
  clips: [],
  transition: 'fade',
  showText: true,
  textStyle: {
    fontWeight: 'normal',
    color: '#ffffff',
    underline: false,
    size: 'medium',
    align: 'center',
    decoration: 'none',
    fontFamily: 'var(--font-inter)',
  },
  savedTemplates: [
    {
      id: 'template-1',
      name: 'Default',
      style: {
        fontWeight: 'normal',
        color: '#ffffff',
        underline: false,
        size: 'medium',
        align: 'center',
        decoration: 'none',
        fontFamily: 'var(--font-inter)',
      },
    },
    {
      id: 'template-2',
      name: 'Bold Yellow',
      style: {
        fontWeight: 'bold',
        color: '#FFD700',
        underline: false,
        size: 'large',
        align: 'center',
        decoration: 'shadow1',
        fontFamily: 'var(--font-roboto)',
      },
    },
  ],
};

export default function DashboardPage() {
  // Initialize the main reel state
  const [reelState, setReelState] = useState<ReelState>(defaultReelState);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from localStorage
  useEffect(() => {
    const loadInitialState = async () => {
      const savedState = localStorage.getItem('reelState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setReelState(prev => ({
            ...prev,
            ...parsedState,
          }));
        } catch (error) {
          console.error('Failed to parse saved state:', error);
        }
      }
      // Add a small delay to prevent flash of prompt page
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loadInitialState();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (reelState.prompt) { // Only save if we have a prompt (active session)
      localStorage.setItem('reelState', JSON.stringify(reelState));
    }
  }, [reelState]);

  // Handle the initial prompt submission and content generation
  const handlePromptSubmit = async (prompt: string, content: ReelContent, bgMusicUrl: string | null) => {
    setReelState(prev => ({
      ...prev,
      prompt,
      clips: content.clips,
      style: content.style,
      bgMusicKeywords: content.bgMusicKeywords,
      bgMusic: bgMusicUrl,
      voiceSettings: {
        voiceId: 'Joey',
        engine: 'neural'
      }
    }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Render either the prompt page or main editor based on whether we have a prompt
  return (
    <main className="min-h-screen">
      {!reelState.prompt ? (
        <>
          <Navbar />
          <PromptPage onSubmit={handlePromptSubmit} />
        </>
      ) : (
        <MainEditorPage reelState={reelState} setReelState={setReelState} />
      )}
    </main>
  );
} 