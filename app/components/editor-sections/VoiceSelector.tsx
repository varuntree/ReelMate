'use client';

import { useState } from 'react';
import { AVAILABLE_VOICES } from '@/app/api/services/pollyService';
import { Engine } from '@aws-sdk/client-polly';
import { FaPlay, FaPause } from 'react-icons/fa';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  selectedEngine: Engine;
  onVoiceChange: (voiceId: string, engine: Engine) => void;
  sampleText: string;
}

export default function VoiceSelector({
  selectedVoiceId,
  selectedEngine,
  onVoiceChange,
  sampleText,
}: VoiceSelectorProps) {
  const [selectedAccent, setSelectedAccent] = useState<keyof typeof AVAILABLE_VOICES>("English (US)");
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null);

  const handleVoiceChange = async (voiceId: string) => {
    const voice = AVAILABLE_VOICES[selectedAccent].find(v => v.id === voiceId);
    if (!voice) return;

    // Always use standard engine
    await previewVoice(voiceId, "standard");
    onVoiceChange(voiceId, "standard");
  };

  const previewVoice = async (voiceId: string, engine: Engine) => {
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sampleText,
          voiceSettings: { voiceId, engine },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice preview');
      }

      const { audioBase64 } = await response.json();
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

      // Stop any currently playing preview
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
      }

      // Create and play new audio
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPreviewVoiceId(null);
      });
      setPreviewAudio(audio);
      setPreviewVoiceId(voiceId);
      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Voice preview error:', error);
    }
  };

  const togglePreview = (voiceId: string) => {
    if (previewAudio && previewVoiceId === voiceId) {
      if (isPlaying) {
        previewAudio.pause();
        setIsPlaying(false);
      } else {
        previewAudio.play();
        setIsPlaying(true);
      }
    } else {
      const voice = AVAILABLE_VOICES[selectedAccent].find(v => v.id === voiceId);
      if (!voice) return;
      previewVoice(voiceId, "standard");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Accent
        </label>
        <select
          value={selectedAccent}
          onChange={(e) => setSelectedAccent(e.target.value as keyof typeof AVAILABLE_VOICES)}
          className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
        >
          {Object.keys(AVAILABLE_VOICES).map((accent) => (
            <option key={accent} value={accent}>
              {accent}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Voice
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_VOICES[selectedAccent].map((voice) => (
            <div
              key={voice.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                selectedVoiceId === voice.id
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-blue-500/50'
              }`}
            >
              <button
                onClick={() => handleVoiceChange(voice.id)}
                className="flex-1 text-left"
              >
                <div className="font-medium">{voice.id}</div>
                <div className="text-sm text-gray-400">{voice.gender}</div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePreview(voice.id);
                }}
                className="ml-2 rounded-full bg-gray-600 p-2 hover:bg-gray-500"
              >
                {isPlaying && previewVoiceId === voice.id ? (
                  <FaPause size={12} />
                ) : (
                  <FaPlay size={12} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 