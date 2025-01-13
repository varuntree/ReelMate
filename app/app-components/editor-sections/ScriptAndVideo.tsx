// Component for managing script generation and video selection
'use client';

import { useState, useEffect, useRef } from 'react';
import { type ReelState } from '../../page';
import { type ReelTheme, type TextClip } from "@/app/types/api";
import { type PexelsVideo } from '@/app/api/services/pexelsService';
import { FaVideo, FaSearch, FaPlay, FaPause, FaTrash, FaPlus } from 'react-icons/fa';
import { Expandable } from '@/components/ui/expandable';

interface ScriptAndVideoProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
  onVideoSelect: (video: PexelsVideo, clipIndex: number) => void;
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
      const response = await fetch('/api/video/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to search videos');
      }

      const data = await response.json();
      setVideos(data.videos);
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

function AutoGrowTextArea({ value, onChange, className = '' }: { 
  value: string; 
  onChange: (value: string) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full resize-none rounded-lg border border-gray-200 bg-white p-2 text-text focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
      rows={1}
    />
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

  const handleVideoSelect = (video: PexelsVideo) => {
    if (selectedClipIndex === null) return;
    onVideoSelect(video, selectedClipIndex);
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

  const handleDeleteClip = (index: number) => {
    setReelState((prev) => ({
      ...prev,
      clips: prev.clips.filter((_, i) => i !== index),
    }));
  };

  const handleAddClip = () => {
    const firstClipVideo = reelState.clips[0]?.video;
    const newClip: TextClip = {
      text: '',
      video: firstClipVideo,
      videoKeywords: [],
      voiceAudio: undefined,
      duration: firstClipVideo?.duration || 0,
    };
    
    setReelState((prev) => ({
      ...prev,
      clips: [
        ...prev.clips.slice(0, -1),
        newClip,
        prev.clips[prev.clips.length - 1],
      ],
    }));
  };

  const renderClip = (clip: TextClip, index: number, isMiddleClip: boolean = false) => (
    <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">
            Clip {index + 1}
          </span>
          {clip.voiceAudio && (
            <button
              onClick={() => toggleAudioPlayback(index)}
              className="rounded bg-background p-1 text-text hover:bg-background/80"
            >
              {playingAudioIndex === index ? <FaPause /> : <FaPlay />}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isMiddleClip && (
            <button
              onClick={() => handleDeleteClip(index)}
              className="flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600 transition-colors"
            >
              <FaTrash className="text-xs" />
            </button>
          )}
          <button
            onClick={() => {
              setSelectedClipIndex(index);
              setIsVideoModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-sm text-white hover:bg-secondary transition-colors"
          >
            <FaVideo className="text-xs" />
            {clip.video ? 'Change Video' : 'Select Video'}
          </button>
        </div>
      </div>
      
      <AutoGrowTextArea
        value={clip.text}
        onChange={(newText) => handleClipTextChange(index, newText)}
      />
    </div>
  );

  return (
    <section className="rounded-lg bg-background p-6">
      <h2 className="mb-4 text-xl font-bold text-text">Script and Video</h2>
      
      <div className="space-y-4">
        {/* First Clip */}
        {reelState.clips.length > 0 && renderClip(reelState.clips[0], 0)}
        
        {/* Middle Clips */}
        {reelState.clips.length > 2 && (
          <Expandable 
            title="Middle Clips"
            footer={
              <button
                onClick={handleAddClip}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1 text-sm text-white hover:bg-secondary transition-colors"
              >
                <FaPlus className="text-xs" />
                Add Clip
              </button>
            }
          >
            <div className="space-y-4">
              {reelState.clips.slice(1, -1).map((clip, idx) => 
                renderClip(clip, idx + 1, true)
              )}
            </div>
          </Expandable>
        )}
        
        {/* Last Clip */}
        {reelState.clips.length > 1 && 
          renderClip(reelState.clips[reelState.clips.length - 1], reelState.clips.length - 1)
        }
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