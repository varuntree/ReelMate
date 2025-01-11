// Component for displaying the live preview of the reel
'use client';

import { useEffect, useRef, useState } from 'react';
import { type ReelState } from '../page';

interface VideoPreviewProps {
  reelState: ReelState;
}

export default function VideoPreview({ reelState }: VideoPreviewProps) {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const currentClip = reelState.clips[currentClipIndex];

  return (
    <div>
      {/* Video Preview Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
        {/* Video Background */}
        {currentClip?.video && (
          <video
            src={currentClip.video.url}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Text Overlay */}
        {currentClip?.text && reelState.showText && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '85%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              textAlign: reelState.textStyle.align,
              color: reelState.textStyle.color,
              fontWeight: reelState.textStyle.fontWeight,
              fontFamily: reelState.textStyle.fontFamily,
              textDecoration: reelState.textStyle.underline ? 'underline' : 'none',
              fontSize: reelState.textStyle.size === 'small' ? '1rem' :
                       reelState.textStyle.size === 'medium' ? '1.25rem' : '1.5rem',
            }}
          >
            {currentClip.text}
          </div>
        )}
      </div>

      {/* Preview Controls */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Clip {currentClipIndex + 1} of {reelState.clips.length}
          </span>
          <span>Size: 9:16</span>
        </div>
        {/* Clip Navigation */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentClipIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentClipIndex === 0}
            className="rounded bg-gray-700 px-3 py-1 text-white hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentClipIndex((prev) => Math.min(reelState.clips.length - 1, prev + 1))}
            disabled={currentClipIndex === reelState.clips.length - 1}
            className="rounded bg-gray-700 px-3 py-1 text-white hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 