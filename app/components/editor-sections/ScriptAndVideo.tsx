// Component for managing script generation and video selection
'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';

interface ScriptAndVideoProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function ScriptAndVideo({
  reelState,
  setReelState,
}: ScriptAndVideoProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for video search/selection
  const handleVideoSearch = async () => {
    setIsLoading(true);
    // TODO: Implement video search using stock video API
    setIsLoading(false);
  };

  // Placeholder for script generation
  const handleGenerateScript = async () => {
    setIsLoading(true);
    // TODO: Implement AI script generation
    setIsLoading(false);
  };

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Script & Video</h2>
      
      {/* Prompt Display */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Your Prompt
        </label>
        <div className="rounded-lg bg-gray-700 p-3 text-gray-300">
          {reelState.prompt}
        </div>
      </div>

      {/* Script Section */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Script</label>
          <button
            onClick={handleGenerateScript}
            disabled={isLoading}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Generate Script
          </button>
        </div>
        <textarea
          value={reelState.script}
          onChange={(e) =>
            setReelState((prev) => ({ ...prev, script: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white"
          rows={4}
          placeholder="Generated script will appear here..."
        />
      </div>

      {/* Video Selection */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Stock Videos
          </label>
          <button
            onClick={handleVideoSearch}
            disabled={isLoading}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Search Videos
          </button>
        </div>
        <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
          <p className="text-center text-gray-400">
            {isLoading
              ? 'Loading videos...'
              : 'Click "Search Videos" to find relevant stock footage'}
          </p>
          {/* TODO: Add video grid/list component here */}
        </div>
      </div>
    </section>
  );
} 