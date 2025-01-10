// Component for the initial prompt input page
'use client';

import { useState } from 'react';
import { type GenerateReelContentResponse, type ReelContent } from '@/app/types/api';
import { PlaceholdersAndVanishInput } from '@/app/app-components/ui/placeholders-and-vanish-input';
import { FlipWords } from '@/app/app-components/ui/flip-words';
import { MultiStepLoader } from '@/app/app-components/ui/multi-step-loader';

interface PromptPageProps {
  onSubmit: (prompt: string, content: ReelContent, bgMusicUrl: string | null) => Promise<void>;
}

export default function PromptPage({ onSubmit }: PromptPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const loadingStates = [
    { text: "Analyzing your prompt..." },
    { text: "Generating script content..." },
    { text: "Finding perfect video clips..." },
    { text: "Creating voice narration..." },
    { text: "Selecting background music..." },
    { text: "Composing your reel..." },
    { text: "Finalizing content..." },
    { text: "Almost ready..." }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const promptValue = (e.currentTarget.elements[0] as HTMLInputElement).value;
    
    if (!promptValue.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Generate reel content with all data
      const response = await fetch('/api/reel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptValue,
          includeBgMusicCategory: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate reel content');
      }
      
      const { content, error } = await response.json() as GenerateReelContentResponse;
      if (error || !content) throw new Error(error || 'Failed to generate content');

      // Update parent state with the generated content
      await onSubmit(promptValue.trim(), content, content.bgMusicUrl || null);
    } catch (error) {
      console.error('Error generating reel:', error);
      alert('Failed to generate reel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const placeholders = [
    "Create a reel about healthy breakfast recipes",
    "Make a reel showcasing workout routines",
    "Generate a reel about productivity tips",
    "Create a reel about travel destinations",
    "Make a reel about tech gadget reviews"
  ];

  const flipWords = ["Creation", "Publishing", "Success"];

  return (
    <div className="min-h-screen w-full bg-background bg-grid-black/[0.2] relative flex items-center justify-center p-4">
      {/* Radial gradient overlay */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
            Instant Reel <FlipWords words={flipWords} className="text-primary" />
          </h1>
          <p className="text-lg sm:text-xl text-text/80 max-w-xl mx-auto">
            Automatic Publishing: Boost Your Revenue with Zero Effort. Our AI Does the Heavy Lifting for You
          </p>
        </div>

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => {}}
          onSubmit={handleSubmit}
        />
      </div>

      <MultiStepLoader 
        loadingStates={loadingStates} 
        loading={isLoading} 
        duration={2000}
        loop={false}
      />
    </div>
  );
} 