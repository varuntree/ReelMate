// Component for the initial prompt input page
'use client';

import { useState } from 'react';

interface PromptPageProps {
  onSubmit: (prompt: string) => void;
}

export default function PromptPage({ onSubmit }: PromptPageProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
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
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
            disabled={!prompt.trim()}
          >
            Create Reel
          </button>
        </form>
      </div>
    </div>
  );
} 