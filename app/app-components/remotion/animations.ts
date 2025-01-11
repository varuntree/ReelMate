import { spring } from 'remotion';
import { TIMING } from './utils';

// Get transition style based on transition type and progress
export const getTransitionStyle = (
  transitionType: string,
  clipIndex: number,
  relativeFrame: number,
  clipDuration: number,
  fps: number
) => {
  const isTransitionIn = relativeFrame < TIMING.transitionDuration;
  const isTransitionOut = relativeFrame > clipDuration - TIMING.transitionDuration;
  
  if (!isTransitionIn && !isTransitionOut) {
    return { opacity: 1 };
  }

  const progress = spring({
    fps,
    frame: isTransitionIn ? relativeFrame : clipDuration - relativeFrame,
    config: {
      damping: 100,
      mass: 0.5,
      stiffness: 100,
    },
    durationInFrames: TIMING.transitionDuration,
  });

  // Ensure the previous clip stays visible during transition
  const opacity = isTransitionIn ? progress : 1;

  switch (transitionType) {
    case 'fade':
      return { opacity };
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

// Get text style based on text configuration
export const getTextStyle = (textStyle: any) => ({
  color: textStyle.color,
  fontSize: textStyle.size === 'small' ? '3rem' : 
           textStyle.size === 'medium' ? '4rem' : '5rem',
  fontWeight: textStyle.fontWeight,
  fontFamily: textStyle.fontFamily,
  textDecoration: textStyle.underline ? 'underline' : 'none',
  textShadow: textStyle.decoration === 'shadow1' ? '2px 2px 4px rgba(0,0,0,0.5)' :
              textStyle.decoration === 'shadow2' ? '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)' :
              textStyle.decoration === 'shadow3' ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' :
              'none',
}); 