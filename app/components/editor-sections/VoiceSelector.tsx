'use client';

import { useState } from 'react';
import { Engine } from '@aws-sdk/client-polly';
import { FaPlay, FaPause } from 'react-icons/fa';

interface VoiceSettings {
  voiceId: string;
  engine: Engine;
}

interface VoiceSelectorProps {
  voiceSettings: VoiceSettings;
  onVoiceChange: (settings: VoiceSettings) => void;
}

const VOICES = [
  { id: 'Joey', name: 'Joey (Male)', engine: 'neural' as Engine },
  { id: 'Matthew', name: 'Matthew (Male)', engine: 'neural' as Engine },
  { id: 'Joanna', name: 'Joanna (Female)', engine: 'neural' as Engine },
  { id: 'Kendra', name: 'Kendra (Female)', engine: 'neural' as Engine },
  { id: 'Kimberly', name: 'Kimberly (Female)', engine: 'neural' as Engine },
  { id: 'Salli', name: 'Salli (Female)', engine: 'neural' as Engine },
  { id: 'Justin', name: 'Justin (Male)', engine: 'standard' as Engine },
  { id: 'Kevin', name: 'Kevin (Male)', engine: 'standard' as Engine },
];

export default function VoiceSelector({
  voiceSettings,
  onVoiceChange,
}: VoiceSelectorProps) {
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewText] = useState("Hello! This is a sample voice preview.");

  const generatePreview = async (voiceId: string, engine: Engine) => {
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: previewText,
          voiceSettings: { voiceId, engine },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice preview');
      }

      const { audioBase64 } = await response.json();
      return `data:audio/mp3;base64,${audioBase64}`;
    } catch (error) {
      console.error('Voice preview generation error:', error);
      return null;
    }
  };

  const handlePreview = async (voiceId: string, engine: Engine) => {
    if (previewAudio) {
      previewAudio.pause();
      setIsPlaying(false);
      setPreviewAudio(null);
      return;
    }

    const audioUrl = await generatePreview(voiceId, engine);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setPreviewAudio(null);
    });

    setPreviewAudio(audio);
    setIsPlaying(true);
    audio.play();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {VOICES.map((voice) => (
          <div
            key={voice.id}
            className={`flex flex-col items-center rounded-lg border p-3 ${
              voiceSettings.voiceId === voice.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-600 bg-gray-700 hover:border-blue-500/50'
            }`}
          >
            <div className="mb-2 text-center text-sm font-medium text-white">
              {voice.name}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePreview(voice.id, voice.engine)}
                className="rounded bg-gray-600 p-2 text-white hover:bg-gray-500"
              >
                {isPlaying && previewAudio ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={() => onVoiceChange({ voiceId: voice.id, engine: voice.engine })}
                className={`rounded px-3 py-1 ${
                  voiceSettings.voiceId === voice.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                {voiceSettings.voiceId === voice.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 