'use client';

import { useEffect, useRef } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import { type ReelState } from '../../page';
import { TIMING, VIDEO_CONFIG } from './utils';
import { getTransitionStyle, getTextStyle } from './animations';

interface ReelCompositionProps {
  reelState: ReelState;
}

// Word animation component
interface AnimatedWordProps {
  word: string;
  startFrame: number;
  duration: number;
  style: React.CSSProperties;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({ word, startFrame, duration, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = spring({
    fps,
    frame: frame - startFrame,
    config: {
      damping: 200,
    },
    durationInFrames: 8,
  });

  const scale = spring({
    fps,
    frame: frame - startFrame,
    config: {
      damping: 200,
    },
    from: 1.2,
    to: 1,
    durationInFrames: 8,
  });

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

export default function ReelComposition({ reelState }: ReelCompositionProps) {
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
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '85%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  textAlign: reelState.textStyle.align,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: reelState.textStyle.align === 'left' ? 'flex-start' :
                                reelState.textStyle.align === 'right' ? 'flex-end' : 'center',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {clip.text.split(' ').map((word, wordIndex) => {
                  const wordsPerSecond = 2;
                  const framesPerWord = fps / wordsPerSecond;
                  const wordStartFrame = wordIndex * framesPerWord;

                  return (
                    <AnimatedWord
                      key={wordIndex}
                      word={word}
                      startFrame={wordStartFrame}
                      duration={framesPerWord}
                      style={getTextStyle(reelState.textStyle)}
                    />
                  );
                })}
              </div>
            )}

            {/* Global Text Overlays */}
            {reelState.overlayText.map((overlay) => {
              const opacity = spring({
                fps,
                frame: relativeFrame,
                config: {
                  damping: 200,
                },
                durationInFrames: 20,
              });

              return (
                <div
                  key={overlay.id}
                  style={{
                    position: 'absolute',
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity,
                    ...getTextStyle(overlay.style),
                  }}
                >
                  {overlay.text}
                </div>
              );
            })}

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
                  opacity: spring({
                    fps,
                    frame: relativeFrame,
                    config: {
                      damping: 200,
                    },
                    durationInFrames: 20,
                  }),
                }}
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