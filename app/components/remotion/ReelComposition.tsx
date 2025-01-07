'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { type ReelState } from '../../page';

interface ReelCompositionProps {
  reelState: ReelState;
}

// Transition duration in frames (30 frames = 1 second)
const TRANSITION_DURATION = 30;
const CLIP_PADDING = 60; // 2 seconds padding in frames

export default function ReelComposition({ reelState }: ReelCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: number }>({});

  // Load audio durations on mount
  useEffect(() => {
    const loadAudioDurations = async () => {
      const durations: { [key: number]: number } = {};
      
      for (let i = 0; i < reelState.clips.length; i++) {
        const clip = reelState.clips[i];
        if (clip.voiceAudio) {
          try {
            const audio = document.createElement('audio');
            audio.src = clip.voiceAudio;
            await new Promise((resolve) => {
              audio.addEventListener('loadedmetadata', () => {
                durations[i] = audio.duration;
                resolve(null);
              });
              audio.addEventListener('error', () => {
                console.error('Error loading audio for clip', i);
                resolve(null);
              });
            });
          } catch (error) {
            console.error('Error loading audio duration for clip', i, error);
          }
        }
      }
      
      setAudioDurations(durations);
    };

    loadAudioDurations();
  }, [reelState.clips]);

  // Calculate clip durations based on voice audio length plus padding
  const clipDurations = reelState.clips.map((clip, index) => {
    if (clip.voiceAudio && audioDurations[index]) {
      return Math.round(audioDurations[index] * fps) + CLIP_PADDING;
    }
    return fps + CLIP_PADDING; // 3 seconds (1 second + 2 seconds padding)
  });

  // Calculate start frames for each clip, now with overlap for transitions
  const clipStartFrames = clipDurations.reduce<number[]>((acc, duration, i) => {
    if (i === 0) return [0];
    // Start the next clip before the previous one ends (by TRANSITION_DURATION frames)
    return [...acc, acc[i - 1] + duration - TRANSITION_DURATION];
  }, []);

  // Transition effects
  const getTransitionStyle = (clipIndex: number, relativeFrame: number) => {
    const isTransitionIn = relativeFrame < TRANSITION_DURATION;
    const isTransitionOut = relativeFrame > clipDurations[clipIndex] - TRANSITION_DURATION;
    
    if (!isTransitionIn && !isTransitionOut) {
      return { opacity: 1 };
    }

    const progress = isTransitionIn
      ? relativeFrame / TRANSITION_DURATION
      : (clipDurations[clipIndex] - relativeFrame) / TRANSITION_DURATION;

    switch (reelState.transition) {
      case 'fade':
        return {
          opacity: progress,
        };
      case 'slide':
        return {
          opacity: 1,
          transform: `translateX(${isTransitionIn ? (1 - progress) * 100 : (1 - progress) * -100}%)`,
        };
      case 'zoom':
        return {
          opacity: progress,
          transform: `scale(${isTransitionIn ? progress : 2 - progress})`,
        };
      case 'wipe':
        return {
          opacity: 1,
          clipPath: `inset(0 ${isTransitionIn ? (1 - progress) * 100 : progress * 100}% 0 0)`,
        };
      case 'dissolve':
        return {
          opacity: progress,
          filter: `blur(${(1 - progress) * 10}px)`,
        };
      case 'blur':
        return {
          opacity: progress,
          filter: `blur(${(1 - progress) * 20}px)`,
        };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {reelState.clips.map((clip, index) => {
        if (!clip.video) return null;

        const clipDuration = clipDurations[index];
        const relativeFrame = frame - clipStartFrames[index];
        const transitionStyle = getTransitionStyle(index, relativeFrame);
        
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
            {clip.text && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  opacity: spring({
                    fps,
                    frame: relativeFrame,
                    config: {
                      damping: 200,
                    },
                    durationInFrames: 20,
                  }),
                }}
              >
                {clip.text}
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
                    color: overlay.style.color,
                    fontSize: `${overlay.style.fontSize}px`,
                    fontFamily: overlay.style.fontFamily,
                    opacity,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
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