// Component for managing voice generation and background music settings
'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';

interface VoiceAndBgMusicProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function VoiceAndBgMusic({
  reelState,
  setReelState,
}: VoiceAndBgMusicProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Placeholder for voice generation
  const handleGenerateVoice = async () => {
    setIsGenerating(true);
    // TODO: Implement text-to-speech generation
    setIsGenerating(false);
  };

  // Handle voice settings changes
  const handleVoiceSettingChange = (
    setting: keyof ReelState['voiceSettings'],
    value: number | string
  ) => {
    setReelState((prev) => ({
      ...prev,
      voiceSettings: {
        ...prev.voiceSettings,
        [setting]: value,
      },
    }));
  };

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Voice & Music</h2>

      {/* Voice Settings */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-300">Voice Settings</h3>
        
        {/* Voice Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Voice Style
          </label>
          <select
            value={reelState.voiceSettings.voice}
            onChange={(e) => handleVoiceSettingChange('voice', e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
          >
            <option value="default">Default</option>
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        {/* Voice Speed */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Speed: {reelState.voiceSettings.speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={reelState.voiceSettings.speed}
            onChange={(e) =>
              handleVoiceSettingChange('speed', parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Voice Pitch */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Pitch: {reelState.voiceSettings.pitch}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={reelState.voiceSettings.pitch}
            onChange={(e) =>
              handleVoiceSettingChange('pitch', parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Generate Voice Button */}
        <button
          onClick={handleGenerateVoice}
          disabled={isGenerating || !reelState.script}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating Voice...' : 'Generate Voice'}
        </button>
      </div>

      {/* Background Music */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-300">
          Background Music
        </h3>
        <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
          <p className="text-center text-gray-400">
            Background music selection coming soon...
          </p>
          {/* TODO: Add background music selection component */}
        </div>
      </div>
    </section>
  );
} 