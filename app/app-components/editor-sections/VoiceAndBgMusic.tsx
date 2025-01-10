'use client';

import { useState, useEffect } from 'react';
import { type ReelState } from '../../page';
import { type FreesoundTrack } from '@/app/api/services/freesoundService';
import { AnimatedTabs } from './tabs/AnimatedTabs';
import VoiceSettings from './tabs/VoiceSettings';
import BackgroundMusic from './tabs/BackgroundMusic';

interface VoiceAndBgMusicProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

const tabs = [
  { id: 'voice', label: 'Voice Settings' },
  { id: 'music', label: 'Background Music' },
];

export default function VoiceAndBgMusic({
  reelState,
  setReelState,
}: VoiceAndBgMusicProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isPlayingBgMusic, setIsPlayingBgMusic] = useState(false);
  const [bgMusicAudio, setBgMusicAudio] = useState<HTMLAudioElement | null>(null);
  const [isRegeneratingVoices, setIsRegeneratingVoices] = useState(false);
  const [musicResults, setMusicResults] = useState<FreesoundTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingMusicId, setPlayingMusicId] = useState<number | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

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
      setIsLoading(true);
      const response = await fetch('/api/music/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch background music');
      }

      const musicResults = await response.json();
      setMusicResults(musicResults.results);
    } catch (error) {
      console.error('Failed to fetch background music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle music preview
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

  // Handle music selection
  const selectBackgroundMusic = (music: FreesoundTrack) => {
    // Stop any playing preview
    if (previewAudio) {
      previewAudio.pause();
      setPlayingMusicId(null);
    }

    // Stop current background music if playing
    if (bgMusicAudio && isPlayingBgMusic) {
      bgMusicAudio.pause();
      setIsPlayingBgMusic(false);
    }

    // Update state with new music
    setReelState(prev => ({
      ...prev,
      bgMusic: music.previews['preview-hq-mp3']
    }));

    // Create new audio element for background music
    const newAudio = new Audio(music.previews['preview-hq-mp3']);
    newAudio.loop = true;
    setBgMusicAudio(newAudio);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
      if (bgMusicAudio) {
        bgMusicAudio.pause();
      }
    };
  }, [previewAudio, bgMusicAudio]);

  return (
    <section className="rounded-lg bg-white p-4 sm:p-6 border border-primary/20">
      <h2 className="mb-4 text-xl font-bold text-text">Voice and Background Music</h2>
      
      <AnimatedTabs 
        tabs={tabs} 
        defaultTab={activeTab} 
        onChange={setActiveTab}
      />

      <div className="mt-4">
        {activeTab === 'voice' ? (
          <VoiceSettings
            reelState={reelState}
            setReelState={setReelState}
            isRegeneratingVoices={isRegeneratingVoices}
            onVoiceChange={handleVoiceChange}
          />
        ) : (
          <BackgroundMusic
            reelState={reelState}
            setReelState={setReelState}
            musicResults={musicResults}
            isLoading={isLoading}
            playingMusicId={playingMusicId}
            isPlayingBgMusic={isPlayingBgMusic}
            onCategorySelect={handleBgMusicCategoryChange}
            onMusicPreview={toggleMusicPreview}
            onMusicSelect={selectBackgroundMusic}
            onBgMusicToggle={toggleBgMusic}
          />
        )}
      </div>
    </section>
  );
} 