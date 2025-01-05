// Main page component that handles the application flow
'use client';

import { useState } from 'react';
import PromptPage from './components/PromptPage';
import MainEditorPage from './components/MainEditorPage';
import { type ReelTheme } from './types/api';
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
  clips: Array<{
    text: string;
    duration: number;
    videoKeywords: string[];
    selectedVideo?: string;
    voiceAudio?: string;
    videoUrl?: string; // URL of the selected Pixabay video
  }>;
  overlayText: Array<{
    id: string;
    text: string;
    position: { x: number; y: number };
    style: {
      fontSize: number;
      color: string;
      fontFamily: string;
    };
  }>;
  logo?: {
    url: string;
    position: { x: number; y: number };
  };
}

export default function Home() {
  // Initialize the main reel state
  const [reelState, setReelState] = useState<ReelState>({
    prompt: '',
    selectedVideo: null,
    script: '',
    voiceSettings: {
      voiceId: 'Joanna',
      engine: 'neural',
    },
    bgMusic: null,
    overlayText: [],
    clips: [],
  });

  // Handle the initial prompt submission
  const handlePromptSubmit = (prompt: string) => {
    setReelState(prev => ({ ...prev, prompt }));
  };

  // Render either the prompt page or main editor based on whether we have a prompt
  return (
    <main className="min-h-screen">
      {!reelState.prompt ? (
        <PromptPage onSubmit={handlePromptSubmit} />
      ) : (
        <MainEditorPage reelState={reelState} setReelState={setReelState} />
      )}
    </main>
  );
}
