// Component for the initial prompt input page
'use client';

import { useState } from 'react';
import { type GenerateReelContentResponse, type ReelContent } from '@/app/types/api';

interface PromptPageProps {
  onSubmit: (prompt: string, content: ReelContent, bgMusicUrl: string | null) => Promise<void>;
}

export default function PromptPage({ onSubmit }: PromptPageProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Generate reel content with all data
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
      
      const { content, error } = await response.json() as GenerateReelContentResponse;
      if (error || !content) throw new Error(error || 'Failed to generate content');

      // Update parent state with the generated content
      await onSubmit(prompt.trim(), content, content.bgMusicUrl || null);
    } catch (error) {
      console.error('Error generating reel:', error);
      alert('Failed to generate reel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-black justify-center ">
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
              className="w-full rounded-lg border border-gray-600  p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
  );
} 