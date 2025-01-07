// Component for managing script generation and video selection
'use client';

import { useState, useEffect } from 'react';
import { type ReelState } from '../../page';
import { type GenerateReelContentResponse, type ReelTheme, type TextClip } from "@/app/types/api";
import { searchPexelsVideos, type PexelsVideo } from '@/app/api/services/pexelsService';
import { FaVideo, FaSearch, FaPlay, FaPause } from 'react-icons/fa';

interface ScriptAndVideoProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
  onVideoSelect: (video: PexelsVideo) => void;
}

const THEMES: { value: ReelTheme; label: string }[] = [
  { value: 'tutorial', label: 'Tutorial & How-To' },
  { value: 'behindTheScenes', label: 'Behind the Scenes' },
  { value: 'travel', label: 'Travel & Adventure' },
  { value: 'productShowcase', label: 'Product Showcase' },
  { value: 'facts', label: 'Facts & Education' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'educational', label: 'Educational' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'aesthetic', label: 'Aesthetic' },
  { value: 'timeLapse', label: 'Time-Lapse' },
  { value: 'memes', label: 'Memes & Trends' },
  { value: 'custom', label: 'Custom (AI Decides)' },
];

interface VideoSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: string[];
  onVideoSelect: (video: PexelsVideo) => void;
}

function VideoSearchModal({ isOpen, onClose, keywords, onVideoSelect }: VideoSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(keywords.join(' '));
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchPexelsVideos(searchQuery);
      setVideos(response.videos);
    } catch (error) {
      console.error('Failed to search videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-gray-800 p-6">
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
            placeholder="Search videos..."
          />
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            <FaSearch />
          </button>
        </div>

        <div className="grid max-h-[60vh] grid-cols-3 gap-4 overflow-y-auto">
          {isLoading ? (
            <div className="col-span-3 text-center text-gray-400">Loading...</div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="relative cursor-pointer group"
                onClick={() => {
                  onVideoSelect(video);
                  onClose();
                }}
              >
                <img
                  src={video.image}
                  alt={`Video thumbnail`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <FaPlay className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {Math.round(video.duration)}s
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function ScriptAndVideo({
  reelState,
  setReelState,
  onVideoSelect,
}: ScriptAndVideoProps) {
  const [selectedClipIndex, setSelectedClipIndex] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const [audioElements, setAudioElements] = useState<{ [key: number]: HTMLAudioElement | null }>({});

  // Initialize audio elements when clips change
  useEffect(() => {
    reelState.clips.forEach((clip, index) => {
      if (clip.voiceAudio && !audioElements[index]) {
        const audio = new Audio(clip.voiceAudio);
        audio.addEventListener('ended', () => setPlayingAudioIndex(null));
        setAudioElements(prev => ({ ...prev, [index]: audio }));
      }
    });
  }, [reelState.clips]);

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.remove();
        }
      });
    };
  }, []);

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('reelContent');
    if (savedContent) {
      try {
        const content = JSON.parse(savedContent);
        setReelState((prev) => ({
          ...prev,
          clips: content.clips,
          style: content.style,
          bgMusicKeywords: content.bgMusicKeywords,
        }));
      } catch (error) {
        console.error('Failed to parse saved content:', error);
      }
    }
  }, []);

  const handleVideoSelect = (video: PexelsVideo) => {
    if (selectedClipIndex === null) return;
    onVideoSelect(video);
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
          voiceSettings: reelState.voiceSettings,
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

      // Create and store audio element
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => setPlayingAudioIndex(null));
      setAudioElements((prev) => ({ ...prev, [index]: audio }));
    } catch (error) {
      console.error('Voice generation error:', error);
    }
  };

  const handleClipTextChange = async (index: number, newText: string) => {
    setReelState((prev) => ({
      ...prev,
      clips: prev.clips.map((clip, i) =>
        i === index ? { ...clip, text: newText } : clip
      ),
    }));

    // Generate new voice audio after a delay
    const timeoutId = setTimeout(() => {
      generateVoiceForClip(index, newText);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const toggleAudioPlayback = (index: number) => {
    const audio = audioElements[index];
    if (!audio && reelState.clips[index].voiceAudio) {
      // Create new audio element if it doesn't exist
      const newAudio = new Audio(reelState.clips[index].voiceAudio);
      newAudio.addEventListener('ended', () => setPlayingAudioIndex(null));
      setAudioElements(prev => ({ ...prev, [index]: newAudio }));
      newAudio.play();
      setPlayingAudioIndex(index);
    } else if (audio) {
      if (playingAudioIndex === index) {
        audio.pause();
        setPlayingAudioIndex(null);
      } else {
        // Stop any currently playing audio
        if (playingAudioIndex !== null && audioElements[playingAudioIndex]) {
          audioElements[playingAudioIndex]?.pause();
        }
        audio.currentTime = 0;
        audio.play();
        setPlayingAudioIndex(index);
      }
    }
  };

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Script and Video</h2>
      
      {/* Clip List */}
      <div className="space-y-4">
        {reelState.clips.map((clip, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-700 bg-gray-900 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-400">
                Clip {index + 1}
              </span>
              {clip.voiceAudio && (
                <button
                  onClick={() => toggleAudioPlayback(index)}
                  className="rounded bg-gray-700 p-1 text-white hover:bg-gray-600"
                >
                  {playingAudioIndex === index ? <FaPause /> : <FaPlay />}
                </button>
              )}
            </div>
            
            <textarea
              value={clip.text}
              onChange={(e) => handleClipTextChange(index, e.target.value)}
              className="mb-2 w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
              rows={2}
            />
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedClipIndex(index);
                  setIsVideoModalOpen(true);
                }}
                className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                <FaVideo className="text-xs" />
                {clip.video ? 'Change Video' : 'Select Video'}
              </button>
              {clip.video && (
                <span className="text-sm text-gray-400">
                  Video ID: {clip.video.id}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Search Modal */}
      {selectedClipIndex !== null && (
        <VideoSearchModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          keywords={reelState.clips[selectedClipIndex].videoKeywords}
          onVideoSelect={handleVideoSelect}
        />
      )}
    </section>
  );
} 