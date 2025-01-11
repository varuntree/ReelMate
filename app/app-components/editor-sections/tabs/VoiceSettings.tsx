'use client';

import { type ReelState } from '../../../page';
import VoiceSelector from '../VoiceSelector';

interface VoiceSettingsProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
  isRegeneratingVoices: boolean;
  onVoiceChange: (newVoiceSettings: ReelState['voiceSettings']) => Promise<void>;
}

export default function VoiceSettings({
  reelState,
  isRegeneratingVoices,
  onVoiceChange,
}: VoiceSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        {isRegeneratingVoices && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10 rounded-lg">
            <div className="text-white">Regenerating voices...</div>
          </div>
        )}
        <VoiceSelector
          voiceSettings={reelState.voiceSettings}
          onVoiceChange={onVoiceChange}
        />
      </div>
    </div>
  );
} 