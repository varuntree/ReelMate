'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useCurrentScale, useVideoConfig, useCurrentFrame, spring } from 'remotion';
import { type TextClip } from '../../types/api';
import { type ReelState } from '@/app/(sidebar)/dashboard/page';
import { getTextStyle } from './animations';

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

interface DraggableTextProps {
  clipIndex: number;
  clip: TextClip;
  reelState: ReelState;
  updateClip: (clipIndex: number, updater: (clip: TextClip) => TextClip) => void;
}

export const DraggableText: React.FC<DraggableTextProps> = ({
  clipIndex,
  clip,
  reelState,
  updateClip,
}) => {
  const scale = useCurrentScale();
  const scaledBorder = Math.ceil(2 / scale);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { width: videoWidth, height: videoHeight, fps } = useVideoConfig();

  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  const textStyle = useMemo(() => {
    const initialLeft =
      clip.textStyle?.left !== undefined
        ? clip.textStyle.left
        : (videoWidth - 0.9 * videoWidth) / 2;
    const initialTop =
      clip.textStyle?.top !== undefined
        ? clip.textStyle.top
        : (videoHeight - 50) / 2;

    return {
      ...getTextStyle(reelState.textStyle),
      position: 'absolute' as const,
      left: initialLeft,
      top: initialTop,
      width: '90%',
      outline: (hovered || isDragging) ? `${scaledBorder}px solid #0B84F3` : undefined,
      cursor: 'move',
      userSelect: 'none' as const,
      touchAction: 'none',
    };
  }, [
    clip.textStyle,
    hovered,
    isDragging,
    scaledBorder,
    reelState.textStyle,
    videoWidth,
    videoHeight,
  ]);

  const startDragging = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.button !== 0) return;

      const initialX = e.clientX;
      const initialY = e.clientY;
      const initialLeft = clip.textStyle?.left || (videoWidth - 0.9 * videoWidth) / 2;
      const initialTop = clip.textStyle?.top || (videoHeight - 50) / 2;

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        const offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        const offsetY = (pointerMoveEvent.clientY - initialY) / scale;

        updateClip(clipIndex, (c) => ({
          ...c,
          textStyle: {
            ...c.textStyle,
            left: Math.round(initialLeft + offsetX),
            top: Math.round(initialTop + offsetY),
          },
        }));
        setIsDragging(true);
      };

      const onPointerUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', onPointerMove);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp, { once: true });
    },
    [clipIndex, clip.textStyle, scale, updateClip, videoWidth, videoHeight]
  );

  // Calculate words per frame based on clip duration
  const words = clip.text.split(' ');
  const clipDuration = 5 * fps; // Default duration from parent component
  const framesPerWord = Math.floor(clipDuration / words.length);

  return (
    <div
      onPointerDown={startDragging}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={textStyle}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent:
            reelState.textStyle.align === 'left'
              ? 'flex-start'
              : reelState.textStyle.align === 'right'
              ? 'flex-end'
              : 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {words.map((word, wordIndex) => (
          <AnimatedWord
            key={wordIndex}
            word={word}
            startFrame={wordIndex * framesPerWord}
            style={getTextStyle(reelState.textStyle)}
          />
        ))}
      </div>
    </div>
  );
};
