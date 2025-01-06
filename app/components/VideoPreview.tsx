// Component for displaying the live preview of the reel
'use client';

import { useEffect, useRef, useState } from 'react';
import { type ReelState } from '../page';

interface VideoPreviewProps {
  reelState: ReelState;
}

export default function VideoPreview({ reelState }: VideoPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);

  // Update video source when current clip changes
  useEffect(() => {
    if (videoRef.current && reelState.clips[currentClipIndex]?.video) {
      videoRef.current.src = reelState.clips[currentClipIndex].video!.url;
    }
  }, [currentClipIndex, reelState.clips]);

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Preview</h2>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Export Reel
        </button>
      </div>

      {/* Video Preview Container */}
      <div
        ref={containerRef}
        className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black"
      >
        {/* Video Element */}
        {reelState.clips[currentClipIndex]?.video ? (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            controls
            loop
          >
            <source src={reelState.clips[currentClipIndex].video!.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No video selected
          </div>
        )}

        {/* Text Overlays */}
        {reelState.overlayText.map((overlay) => (
          <div
            key={overlay.id}
            style={{
              position: 'absolute',
              left: `${overlay.position.x}%`,
              top: `${overlay.position.y}%`,
              transform: 'translate(-50%, -50%)',
              color: overlay.style.color,
              fontSize: `${overlay.style.fontSize}px`,
              fontFamily: overlay.style.fontFamily,
            }}
          >
            {overlay.text}
          </div>
        ))}

        {/* Logo Overlay */}
        {reelState.logo && (
          <img
            src={reelState.logo.url}
            alt="Logo"
            style={{
              position: 'absolute',
              left: `${reelState.logo.position.x}%`,
              top: `${reelState.logo.position.y}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '20%',
              maxHeight: '20%',
            }}
          />
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