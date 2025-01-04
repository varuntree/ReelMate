// Main page component that handles the application flow
'use client';

import { useState } from 'react';
import PromptPage from './components/PromptPage';
import MainEditorPage from './components/MainEditorPage';

// Define the main reel state interface
export interface ReelState {
  prompt: string;
  selectedVideo: string | null;
  script: string;
  voiceSettings: {
    voice: string;
    pitch: number;
    speed: number;
  };
  bgMusic: string | null;
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
      voice: 'default',
      pitch: 1,
      speed: 1,
    },
    bgMusic: null,
    overlayText: [],
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
