// Component for managing voice and background music settings
'use client';

import { useState, useEffect } from 'react';
import { type ReelState } from '../../page';
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa';
import VoiceSelector from './VoiceSelector';

interface VoiceAndBgMusicProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function VoiceAndBgMusic({
  reelState,
  setReelState,
}: VoiceAndBgMusicProps) {
  const [isPlayingBgMusic, setIsPlayingBgMusic] = useState(false);
  const [bgMusicAudio, setBgMusicAudio] = useState<HTMLAudioElement | null>(null);
  const [isRegeneratingVoices, setIsRegeneratingVoices] = useState(false);

  // Load initial background music
  useEffect(() => {
    if (reelState.bgMusic && !bgMusicAudio) {
      const audio = new Audio(reelState.bgMusic);
      audio.loop = true;
      setBgMusicAudio(audio);
    }
  }, [reelState.bgMusic]);

  // Handle background music playback
  const toggleBgMusic = () => {
    if (!bgMusicAudio) return;

    if (isPlayingBgMusic) {
      bgMusicAudio.pause();
    } else {
      bgMusicAudio.play();
    }
    setIsPlayingBgMusic(!isPlayingBgMusic);
  };

  // Generate voice audio for a single clip
  const generateVoiceForClip = async (text: string, voiceSettings: ReelState['voiceSettings']) => {
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceSettings }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const { audioBase64 } = await response.json();
      return `data:audio/mp3;base64,${audioBase64}`;
    } catch (error) {
      console.error('Voice generation error:', error);
      return null;
    }
  };

  // Handle voice change and regenerate all clip voices
  const handleVoiceChange = async (newVoiceSettings: ReelState['voiceSettings']) => {
    setIsRegeneratingVoices(true);
    
    try {
      // Update voice settings immediately
      setReelState(prev => ({
        ...prev,
        voiceSettings: newVoiceSettings
      }));

      // Generate new voices for all clips in parallel
      const updatedClips = await Promise.all(
        reelState.clips.map(async (clip) => {
          if (!clip.text) return clip;
          
          const newVoiceAudio = await generateVoiceForClip(clip.text, newVoiceSettings);
          return {
            ...clip,
            voiceAudio: newVoiceAudio || clip.voiceAudio // Fallback to old audio if generation fails
          };
        })
      );

      // Update clips with new voice audio
      setReelState(prev => ({
        ...prev,
        clips: updatedClips
      }));
    } catch (error) {
      console.error('Failed to regenerate voices:', error);
      alert('Some voices failed to regenerate. Please try again.');
    } finally {
      setIsRegeneratingVoices(false);
    }
  };

  // Handle background music category change
  const handleBgMusicCategoryChange = async (category: string) => {
    try {
      const response = await fetch('/api/music/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch background music');
      }

      const musicResults = await response.json();
      if (musicResults.results.length > 0) {
        const newBgMusicUrl = musicResults.results[0].previews['preview-hq-mp3'];
        
        // Stop current audio if playing
        if (bgMusicAudio && isPlayingBgMusic) {
          bgMusicAudio.pause();
          setIsPlayingBgMusic(false);
        }

        // Create new audio element
        const newAudio = new Audio(newBgMusicUrl);
        newAudio.loop = true;
        setBgMusicAudio(newAudio);
        
        // Update state
        setReelState(prev => ({
          ...prev,
          bgMusic: newBgMusicUrl
        }));
      }
    } catch (error) {
      console.error('Failed to fetch background music:', error);
    }
  };

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Voice and Background Music</h2>
      
      {/* Voice Settings */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-300">Voice Settings</h3>
        <div className="relative">
          {isRegeneratingVoices && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10">
              <div className="text-white">Regenerating voices...</div>
            </div>
          )}
          <VoiceSelector
            voiceSettings={reelState.voiceSettings}
            onVoiceChange={handleVoiceChange}
          />
        </div>
      </div>

      {/* Background Music */}
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-300">Background Music</h3>
        
        {/* Music Categories */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {[
            'ambient',
            'upbeat',
            'cinematic',
            'electronic',
            'acoustic',
            'inspirational',
            'energetic',
            'relaxing',
            'dramatic',
            'happy'
          ].map((category) => (
            <button
              key={category}
              onClick={() => handleBgMusicCategoryChange(category)}
              className="rounded bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Music Controls */}
        {reelState.bgMusic && (
          <div className="flex items-center gap-4">
            <button
              onClick={toggleBgMusic}
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isPlayingBgMusic ? <FaPause /> : <FaPlay />}
              <span>{isPlayingBgMusic ? 'Pause' : 'Play'} Music</span>
            </button>
            <span className="text-sm text-gray-400">
              <FaMusic className="mr-1 inline" />
              Background Music Selected
            </span>
          </div>
        )}
      </div>
    </section>
  );
} 