'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { type ReelState } from '@/app/(sidebar)/dashboard/page'; 
import ReelComposition from './remotion/ReelComposition';
import { VIDEO_CONFIG, loadAudioDurations, calculateDurationInFrames } from './remotion/utils';
import { type TextClip } from '../types/api';
import { PlayPauseButton } from './remotion/PlayPauseButton';
import { saveReel } from '@/app/api/Firebase/firestoreService';
import { useAuth } from '@/app/hooks/useAuth';
import { toast } from 'sonner';

interface RemotionPreviewProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function RemotionPreview({ reelState, setReelState }: RemotionPreviewProps) {
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: number }>({});
  const playerRef = useRef<PlayerRef>(null);
  const { user, loading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Load audio durations when clips change
  useEffect(() => {
    loadAudioDurations(reelState.clips).then(setAudioDurations);
  }, [reelState.clips]);

  // Calculate total duration based on audio durations
  const durationInFrames = useMemo(
    () => calculateDurationInFrames(reelState.clips, audioDurations),
    [reelState.clips, audioDurations]
  );

  // Don't render player until we have at least one clip with video
  const hasVideoContent = reelState.clips.some((clip) => clip.video);

  const updateClip = (clipIndex: number, updater: (clip: TextClip) => TextClip) => {
    setReelState((prevReelState) => ({
      ...prevReelState,
      clips: prevReelState.clips.map((clip, index) =>
        index === clipIndex ? updater(clip) : clip
      ),
    }));
  };

  const handleSaveReel = async () => {
    console.log('Save button clicked');
    console.log('User:', user);
    
    if (!user) {
      toast.error('Please sign in to save reels');
      return;
    }

    if (!reelState.clips.length) {
      toast.error('Cannot save an empty reel');
      return;
    }

    try {
      setIsSaving(true);
      console.log('Saving reel for user:', user.uid);
      console.log('Reel state:', reelState);
      
      const reelId = await saveReel(user.uid, reelState);
      console.log('Reel saved with ID:', reelId);
      
      toast.success('Reel saved successfully!');
      
      // Clear both state and localStorage
      localStorage.removeItem('reelState');
      setReelState(prev => ({
        ...prev,
        prompt: '',
        selectedVideo: null,
        script: '',
        clips: [],
        bgMusic: null,
      }));
    } catch (error) {
      console.error('Error saving reel:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save reel');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text">Preview</h2>
        <button 
          className="rounded bg-primary px-4 py-2 text-accent rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveReel}
          disabled={isSaving || authLoading}
        >
          {isSaving ? 'Saving...' : authLoading ? 'Loading...' : 'Save to My Reels'}
        </button>
      </div>

      {/* Preview Container */}
      <div className="mx-auto w-full max-w-[390px] bg-background rounded-lg">
        {/* Phone Frame */}
        <div className="relative mx-auto overflow-hidden rounded-[3rem] border-[14px] border-gray-100 bg-white shadow-lg">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-gray-100"></div>

          {/* Video Preview */}
          <div className="relative aspect-[390/844] w-full overflow-hidden bg-gray-50">
            {hasVideoContent ? (
              <Player
                ref={playerRef}
                component={ReelComposition}
                durationInFrames={durationInFrames}
                fps={VIDEO_CONFIG.fps}
                compositionWidth={VIDEO_CONFIG.width}
                compositionHeight={VIDEO_CONFIG.height}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls={false}
                loop
                inputProps={{ reelState, updateClip, setReelState }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Add a video clip to preview
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {reelState.clips.length} Clip{reelState.clips.length !== 1 ? 's' : ''}
            </span>
            <span>Size: 9:16 (1080x1920)</span>
          </div>
          {/* Play/Pause Button */}
          <div className="flex justify-center">
            <PlayPauseButton playerRef={playerRef} />
          </div>
        </div>
      </div>
    </div>
  );
}