// Main page component that handles the application flow
'use client';

import { useState } from 'react';
import PromptPage from './components/PromptPage';
import MainEditorPage from './components/MainEditorPage';
import { type ReelTheme, type TextClip } from './types/api';
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
  transition: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'blur';
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
