'use client';

import { useState, useEffect } from 'react';
import { Engine } from '@aws-sdk/client-polly';
import { Check, Volume2, Play, Pause, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  gradient: string;
}

// Gradients for voices - will be assigned in sequence
const GRADIENTS = [
  "bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400",
  "bg-gradient-to-br from-green-300 via-blue-500 to-purple-600",
  "bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400",
  "bg-gradient-to-br from-yellow-200 via-green-200 to-green-500"
];

export default function VoiceSelector({
  voiceSettings,
  onVoiceChange,
}: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [hoveredVoice, setHoveredVoice] = useState<string | null>(null);
  const [previewText] = useState("Hello! This is a sample voice preview.");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voice/available');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        
        // Transform the data into the format we need
        const voiceList: Voice[] = Object.entries(data).flatMap(([accent, voices], index) => {
          const voiceArray = voices as Array<{ id: string; gender: string }>;
          return voiceArray.map((voice, vIndex) => ({
            id: voice.id,
            name: `${voice.id}`,
            engine: 'neural' as Engine,
            gradient: GRADIENTS[(index + vIndex) % GRADIENTS.length]
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

  const handlePreview = async (voiceId: string, engine: Engine, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (previewAudio && playingVoiceId === voiceId) {
      previewAudio.pause();
      setPlayingVoiceId(null);
      setPreviewAudio(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
    }

    setLoadingPreview(voiceId);
    const audioUrl = await generatePreview(voiceId, engine);
    setLoadingPreview(null);
    
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.addEventListener('ended', () => {
      setPlayingVoiceId(null);
      setPreviewAudio(null);
    });

    setPreviewAudio(audio);
    setPlayingVoiceId(voiceId);
    audio.play();
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading voices...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {voices.map((voice) => (
          <Card
            key={voice.id}
            onMouseEnter={() => setHoveredVoice(voice.id)}
            onMouseLeave={() => setHoveredVoice(null)}
            onClick={() => onVoiceChange({ voiceId: voice.id, engine: voice.engine })}
            className={cn(
              "relative cursor-pointer transition-all duration-300 transform",
              "border-2",
              hoveredVoice === voice.id && "scale-105 shadow-xl",
              voiceSettings.voiceId === voice.id 
                ? "border-primary shadow-lg" 
                : "border-transparent hover:border-primary/50"
            )}
          >
            <div className="p-6 flex items-start gap-6">
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center",
                  "transform transition-all duration-300",
                  voice.gradient,
                  hoveredVoice === voice.id && "scale-110 rotate-12"
                )}
              >
                {hoveredVoice === voice.id && (
                  <Volume2 className="w-8 h-8 text-white animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{voice.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Neural voice with natural intonation
                </p>
              </div>
              {voiceSettings.voiceId === voice.id && (
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
            {hoveredVoice === voice.id && (
              <div 
                className={cn(
                  "absolute inset-0 rounded-lg opacity-10",
                  voice.gradient
                )}
              />
            )}
            <div className="absolute bottom-4 right-4 z-10">
              <Button
                size="sm"
                variant={playingVoiceId === voice.id ? "default" : "outline"}
                className={cn(
                  "rounded-full transition-colors",
                  playingVoiceId === voice.id && "bg-primary text-white hover:bg-primary/90",
                  loadingPreview === voice.id && "opacity-80 cursor-not-allowed"
                )}
                onClick={(e) => handlePreview(voice.id, voice.engine, e)}
                disabled={loadingPreview === voice.id}
              >
                {loadingPreview === voice.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    {playingVoiceId === voice.id ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Preview
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 