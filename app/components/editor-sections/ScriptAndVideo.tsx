// Component for managing script generation and video selection
'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';
import { type GenerateReelContentResponse, type ReelTheme, type TextClip } from "@/app/types/api";
import { searchPixabayVideos, type PixabayVideo } from '@/app/api/services/pixabayService';
import { FaVideo, FaSearch } from 'react-icons/fa';

interface ScriptAndVideoProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
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
  onVideoSelect: (video: PixabayVideo) => void;
}

function VideoSearchModal({ isOpen, onClose, keywords, onVideoSelect }: VideoSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(keywords.join(' '));
  const [videos, setVideos] = useState<PixabayVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchPixabayVideos(searchQuery);
      setVideos(response.hits);
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
                className="cursor-pointer rounded-lg border border-gray-600 p-2 hover:border-blue-500"
                onClick={() => {
                  onVideoSelect(video);
                  onClose();
                }}
              >
                <video
                  src={video.videos.tiny.url}
                  className="h-32 w-full object-cover"
                  loop
                  muted
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => e.currentTarget.pause()}
                />
                <p className="mt-2 text-sm text-gray-300">{video.tags}</p>
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
}: ScriptAndVideoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ReelTheme>('custom');
  const [error, setError] = useState<string | null>(null);
  const [selectedClipIndex, setSelectedClipIndex] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleGenerateScript = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reel/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: reelState.prompt,
          theme: selectedTheme === 'custom' ? undefined : selectedTheme,
          numberOfClips: 5,
        }),
      });

      const data = (await response.json()) as GenerateReelContentResponse;

      if (data.error) {
        setError(data.error);
        return;
      }

      setReelState((prev) => ({
        ...prev,
        clips: data.content.clips.map((clip) => ({
          ...clip,
          videoUrl: '', // Initialize with empty video URL
        })),
        style: data.content.style,
        bgMusicKeywords: data.content.bgMusicKeywords,
      }));
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Script generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (video: PixabayVideo) => {
    if (selectedClipIndex === null) return;

    setReelState((prev) => ({
      ...prev,
      clips: prev.clips.map((clip, index) =>
        index === selectedClipIndex
          ? { ...clip, videoUrl: video.videos.large.url }
          : clip
      ),
    }));
  };

  const handleClipTextChange = (index: number, newText: string) => {
    setReelState((prev) => ({
      ...prev,
      clips: prev.clips.map((clip, i) =>
        i === index ? { ...clip, text: newText } : clip
      ),
    }));
  };

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Script & Video</h2>
      
      {/* Prompt Display */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Your Prompt
        </label>
        <div className="rounded-lg bg-gray-700 p-3 text-gray-300">
          {reelState.prompt}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Reel Theme
        </label>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value as ReelTheme)}
          className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
        >
          {THEMES.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <div className="mb-4">
        <button
          onClick={handleGenerateScript}
          disabled={isLoading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Script & Video Keywords'}
        </button>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* Clips Section */}
      <div className="space-y-4">
        {reelState.clips?.map((clip, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-lg border border-gray-600 bg-gray-700 p-4"
          >
            {/* Text Area */}
            <div className="flex-1">
              <textarea
                value={clip.text}
                onChange={(e) => handleClipTextChange(index, e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white"
                rows={3}
                placeholder="Clip text..."
              />
              <div className="mt-2 text-sm text-gray-400">
                Keywords: {clip.videoKeywords.join(', ')}
              </div>
            </div>

            {/* Video Selection */}
            <div className="flex w-32 flex-col items-center justify-center">
              {clip.videoUrl ? (
                <video
                  src={clip.videoUrl}
                  className="h-24 w-full cursor-pointer rounded object-cover"
                  loop
                  muted
                  onClick={() => {
                    setSelectedClipIndex(index);
                    setIsVideoModalOpen(true);
                  }}
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => e.currentTarget.pause()}
                />
              ) : (
                <button
                  onClick={() => {
                    setSelectedClipIndex(index);
                    setIsVideoModalOpen(true);
                  }}
                  className="flex h-24 w-full items-center justify-center rounded border-2 border-dashed border-gray-500 text-gray-400 hover:border-blue-500 hover:text-blue-500"
                >
                  <FaVideo size={24} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Search Modal */}
      {selectedClipIndex !== null && reelState.clips[selectedClipIndex] && (
        <VideoSearchModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setSelectedClipIndex(null);
          }}
          keywords={reelState.clips[selectedClipIndex].videoKeywords}
          onVideoSelect={handleVideoSelect}
        />
      )}
    </section>
  );
} 