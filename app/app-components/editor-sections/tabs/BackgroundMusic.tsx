'use client';

import { type ReelState } from '../../../page';
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa';
import { type FreesoundTrack } from '@/app/api/services/freesoundService';

interface BackgroundMusicProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
  musicResults: FreesoundTrack[];
  isLoading: boolean;
  playingMusicId: number | null;
  isPlayingBgMusic: boolean;
  onCategorySelect: (category: string) => Promise<void>;
  onMusicPreview: (music: FreesoundTrack) => void;
  onMusicSelect: (music: FreesoundTrack) => void;
  onBgMusicToggle: () => void;
}

export default function BackgroundMusic({
  reelState,
  musicResults,
  isLoading,
  playingMusicId,
  isPlayingBgMusic,
  onCategorySelect,
  onMusicPreview,
  onMusicSelect,
  onBgMusicToggle,
}: BackgroundMusicProps) {
  const categories = [
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
  ];

  return (
    <div className="space-y-4">
      {/* Music Categories */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className="rounded bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Music Results */}
      {isLoading ? (
        <div className="text-center text-gray-400">Loading music...</div>
      ) : musicResults.length > 0 ? (
        <div className="space-y-2 max-h-[calc(100vh-24rem)] overflow-y-auto rounded-lg">
          {musicResults.map((music) => (
            <div
              key={music.id}
              className={`flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-3 ${
                reelState.bgMusic === music.previews['preview-hq-mp3'] ? 'border-blue-500' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{music.name}</div>
                <div className="text-sm text-gray-400 truncate">
                  By {music.username} • {Math.round(music.duration)}s
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <button
                  onClick={() => onMusicPreview(music)}
                  className="rounded-full bg-gray-600 p-2 text-white hover:bg-gray-500"
                >
                  {playingMusicId === music.id ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={() => onMusicSelect(music)}
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
      ) : null}

      {/* Selected Music Controls */}
      {reelState.bgMusic && (
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onBgMusicToggle}
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
  );
} 