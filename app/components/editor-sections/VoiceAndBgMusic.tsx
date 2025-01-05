// Component for managing voice generation and background music settings
'use client';

import { useState, useEffect } from 'react';
import { type ReelState } from '../../page';
import VoiceSelector from './VoiceSelector';
import { Engine } from '@aws-sdk/client-polly';
import { MUSIC_CATEGORIES, searchFreesoundMusic, type FreesoundTrack } from '@/app/api/services/freesoundService';
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa';

interface VoiceAndBgMusicProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function VoiceAndBgMusic({
  reelState,
  setReelState,
}: VoiceAndBgMusicProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [musicResults, setMusicResults] = useState<FreesoundTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playingMusicId, setPlayingMusicId] = useState<number | null>(null);

  const handleVoiceChange = (voiceId: string) => {
    setReelState((prev) => ({
      ...prev,
      voiceSettings: {
        ...prev.voiceSettings,
        voiceId,
      },
    }));

    // Regenerate all clip audios with new voice
    reelState.clips.forEach((clip, index) => {
      if (clip.text) {
        generateVoiceForClip(index, clip.text);
      }
    });
  };

  const generateVoiceForClip = async (index: number, text: string) => {
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceSettings: { voiceId: reelState.voiceSettings.voiceId },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const { audioBase64 } = await response.json();
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

      setReelState((prev) => ({
        ...prev,
        clips: prev.clips.map((clip, i) =>
          i === index ? { ...clip, voiceAudio: audioUrl } : clip
        ),
      }));
    } catch (error) {
      console.error('Voice generation error:', error);
    }
  };

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);

    try {
      const category = MUSIC_CATEGORIES.find(c => c.id === categoryId);
      if (!category) return;

      const response = await searchFreesoundMusic(category.keywords);
      setMusicResults(response.results);
    } catch (error) {
      console.error('Failed to fetch music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMusicPreview = (music: FreesoundTrack) => {
    if (previewAudio) {
      previewAudio.pause();
      if (playingMusicId === music.id) {
        setPlayingMusicId(null);
        return;
      }
    }

    const audio = new Audio(music.previews['preview-hq-mp3']);
    audio.addEventListener('ended', () => setPlayingMusicId(null));
    setPreviewAudio(audio);
    setPlayingMusicId(music.id);
    audio.play();
  };

  const selectBackgroundMusic = (music: FreesoundTrack) => {
    setReelState(prev => ({
      ...prev,
      bgMusic: music.previews['preview-hq-mp3'],
    }));
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
      }
    };
  }, [previewAudio]);

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Voice & Background Music</h2>

      {/* Voice Settings */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Voice Settings</h3>
        <VoiceSelector
          selectedVoiceId={reelState.voiceSettings.voiceId}
          selectedEngine="standard"
          onVoiceChange={handleVoiceChange}
          sampleText={reelState.clips[0]?.text || "Hello! This is a sample voice preview."}
        />
      </div>

      {/* Background Music */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Background Music</h3>
        
        {/* Music Categories */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MUSIC_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-blue-500/50'
              }`}
            >
              <FaMusic className="text-lg" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Music Results */}
        {isLoading ? (
          <div className="text-center text-gray-400">Loading music...</div>
        ) : (
          <div className="space-y-2">
            {musicResults.map((music) => (
              <div
                key={music.id}
                className={`flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-3 ${
                  reelState.bgMusic === music.previews['preview-hq-mp3'] ? 'border-blue-500' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-white">{music.name}</div>
                  <div className="text-sm text-gray-400">
                    By {music.username} • {Math.round(music.duration)}s
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMusicPreview(music)}
                    className="rounded-full bg-gray-600 p-2 text-white hover:bg-gray-500"
                  >
                    {playingMusicId === music.id ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={() => selectBackgroundMusic(music)}
                    className={`rounded-lg px-3 py-1 ${
                      reelState.bgMusic === music.previews['preview-hq-mp3']
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {reelState.bgMusic === music.previews['preview-hq-mp3'] ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 