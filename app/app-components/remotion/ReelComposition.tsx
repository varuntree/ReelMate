'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  useCurrentFrame,
  useVideoConfig,
  spring,
  useCurrentScale,
} from 'remotion';
import { type ReelState } from '@/app/(sidebar)/dashboard/page'; 
import { TIMING, VIDEO_CONFIG } from './utils';
import { getTransitionStyle, getTextStyle } from './animations';
import { DraggableText } from './Draggable';
import { type TextClip } from '../../types/api';

interface ReelCompositionProps {
  reelState: ReelState;
  updateClip: (clipIndex: number, updater: (clip: TextClip) => TextClip) => void;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

// Word animation component
interface AnimatedWordProps {
  word: string;
  startFrame: number;
  style: React.CSSProperties;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({ word, startFrame, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    fps,
    frame: frame - startFrame,
    config: {
      damping: 200,
    },
    durationInFrames: 8,
  });

  const opacity = progress;
  const scale = 1 + (1 - progress) * 0.2;

  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        opacity,
        transform: `scale(${scale})`,
        margin: '0 4px',
      }}
    >
      {word}
    </span>
  );
};

export default function ReelComposition({ reelState, updateClip, setReelState }: ReelCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate clip durations based on voice audio length plus minimum spacing
  const clipDurations = reelState.clips.map((clip) => {
    return 5 * fps + TIMING.minClipSpacing; // Default duration
  });

  // Calculate start frames for each clip with overlapping transitions
  const clipStartFrames = clipDurations.reduce<number[]>((acc, duration, i) => {
    if (i === 0) return [0];
    const previousEnd = acc[i - 1] + clipDurations[i - 1];
    return [...acc, previousEnd - TIMING.transitionDuration];
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {reelState.clips.map((clip, index) => {
        if (!clip.video) return null;

        const clipDuration = clipDurations[index];
        const relativeFrame = frame - clipStartFrames[index];
        const transitionStyle = getTransitionStyle(
          reelState.transition,
          index,
          relativeFrame,
          clipDuration,
          fps
        );
        
        return (
          <Sequence
            key={index}
            from={clipStartFrames[index]}
            durationInFrames={clipDuration}
          >
            {/* Video Layer */}
            <div style={{ 
              position: 'absolute',
              width: '100%', 
              height: '100%',
              ...transitionStyle 
            }}>
              <Video
                src={clip.video.url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                muted
                playsInline
              />
            </div>

            {/* Voice Audio Layer */}
            {clip.voiceAudio && (
              <Audio
                src={clip.voiceAudio}
                volume={1}
              />
            )}

            {/* Clip Text Overlay */}
            {clip.text && reelState.showText && (
              <DraggableText
                clipIndex={index}
                clip={clip}
                reelState={reelState}
                updateClip={updateClip}
              />
            )}
          </Sequence>
        );
      })}

      {/* Background Music */}
      {reelState.bgMusic && (
        <Audio
          src={reelState.bgMusic}
          volume={0.3}
        />
      )}
    </AbsoluteFill>
  );
}