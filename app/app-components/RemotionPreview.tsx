'use client';

import { useEffect, useMemo, useState } from 'react';
import { Player } from '@remotion/player';
import { type ReelState } from '../page';
import ReelComposition from './remotion/ReelComposition';
import { VIDEO_CONFIG, loadAudioDurations, calculateDurationInFrames } from './remotion/utils';

interface RemotionPreviewProps {
  reelState: ReelState;
}

export default function RemotionPreview({ reelState }: RemotionPreviewProps) {
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: number }>({});

  // Load audio durations when clips change
  useEffect(() => {
    loadAudioDurations(reelState.clips).then(setAudioDurations);
  }, [reelState.clips]);

  // Calculate total duration based on audio durations
  const durationInFrames = useMemo(() => 
    calculateDurationInFrames(reelState.clips, audioDurations),
    [reelState.clips, audioDurations]
  );

  // Don't render player until we have at least one clip with video
  const hasVideoContent = reelState.clips.some(clip => clip.video);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Preview</h2>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Export Reel
        </button>
      </div>

      {/* Preview Container */}
      <div className="mx-auto w-full max-w-[390px]">
        {/* Phone Frame */}
        <div className="relative mx-auto overflow-hidden rounded-[3rem] border-[14px] border-gray-900 bg-white shadow-xl">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-3xl bg-black"></div>
          
          {/* Video Preview */}
          <div className="relative aspect-[390/844] w-full overflow-hidden bg-black">
            {hasVideoContent ? (
              <Player
                component={ReelComposition}
                durationInFrames={durationInFrames}
                fps={VIDEO_CONFIG.fps}
                compositionWidth={VIDEO_CONFIG.width}
                compositionHeight={VIDEO_CONFIG.height}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                loop
                inputProps={{ reelState }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Add a video clip to preview
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              {reelState.clips.length} Clip{reelState.clips.length !== 1 ? 's' : ''}
            </span>
            <span>Size: 9:16 (1080x1920)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 