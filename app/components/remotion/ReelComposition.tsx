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
const MIN_CLIP_SPACING = 60; // 2 seconds minimum spacing between clips

interface AnimatedWordProps {
  word: string;
  startFrame: number;
  duration: number;
  style: React.CSSProperties;
}

// Word animation component
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

  // Calculate clip durations based on voice audio length plus minimum spacing
  const clipDurations = reelState.clips.map((clip, index) => {
    if (clip.voiceAudio && audioDurations[index]) {
      return Math.round(audioDurations[index] * fps) + MIN_CLIP_SPACING;
    }
    return 5 * fps + MIN_CLIP_SPACING; // 5 seconds + spacing for clips without audio
  });

  // Calculate start frames for each clip with overlapping transitions
  const clipStartFrames = clipDurations.reduce<number[]>((acc, duration, i) => {
    if (i === 0) return [0];
    // Start the next clip before the current one ends to create smooth transition
    const previousEnd = acc[i - 1] + clipDurations[i - 1];
    return [...acc, previousEnd - TRANSITION_DURATION];
  }, []);

  // Enhanced transition effects with smoother animations
  const getTransitionStyle = (clipIndex: number, relativeFrame: number) => {
    const isTransitionIn = relativeFrame < TRANSITION_DURATION;
    const isTransitionOut = relativeFrame > clipDurations[clipIndex] - TRANSITION_DURATION;
    
    if (!isTransitionIn && !isTransitionOut) {
      return { opacity: 1 };
    }

    const progress = spring({
      fps,
      frame: isTransitionIn ? relativeFrame : clipDurations[clipIndex] - relativeFrame,
      config: {
        damping: 100,
        mass: 0.5,
        stiffness: 100,
      },
      durationInFrames: TRANSITION_DURATION,
    });

    // Ensure the previous clip stays visible during transition
    const opacity = isTransitionIn ? progress : 1;

    switch (reelState.transition) {
      case 'fade':
        return {
          opacity,
        };
      case 'slide':
        return {
          opacity: 1,
          transform: `translateX(${isTransitionIn ? (1 - progress) * 100 : (1 - progress) * -100}%)`,
        };
      case 'zoom':
        return {
          opacity,
          transform: `scale(${isTransitionIn ? progress : 2 - progress})`,
        };
      case 'wipe':
        return {
          opacity: 1,
          clipPath: `inset(0 ${isTransitionIn ? (1 - progress) * 100 : progress * 100}% 0 0)`,
        };
      case 'dissolve':
        return {
          opacity,
          filter: `blur(${(1 - progress) * 10}px)`,
        };
      case 'blur':
        return {
          opacity,
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
                  top: '85%', // Positioned at the bottom area like TikTok
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)', // Strong text shadow for visibility
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {clip.text.split(' ').map((word, wordIndex) => {
                  // Calculate when each word should appear
                  const wordsPerSecond = 2; // Adjust this value to control speed
                  const framesPerWord = fps / wordsPerSecond;
                  const wordStartFrame = wordIndex * framesPerWord;

                  return (
                    <AnimatedWord
                      key={wordIndex}
                      word={word}
                      startFrame={wordStartFrame}
                      duration={framesPerWord}
                      style={{
                        color: 'white',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      }}
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