'use client';

import { useState, useEffect } from 'react';
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

interface Voice {
  id: string;
  name: string;
  engine: Engine;
}

export default function VoiceSelector({
  voiceSettings,
  onVoiceChange,
}: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewText] = useState("Hello! This is a sample voice preview.");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voice/available');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        
        // Transform the data into the format we need
        const voiceList: Voice[] = Object.entries(data).flatMap(([accent, voices]) => {
          const voiceArray = voices as Array<{ id: string; gender: string }>;
          return voiceArray.map(voice => ({
            id: voice.id,
            name: `${voice.id} (${voice.gender})`,
            engine: 'neural' as Engine // Default to neural engine
          }));
        });
        
        setVoices(voiceList);
      } catch (error) {
        console.error('Failed to fetch voices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, []);

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

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading voices...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {voices.map((voice) => (
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