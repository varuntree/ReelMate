// Video dimensions and settings
export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  previewWidth: 390,
  previewHeight: 844,
} as const;

// Animation timings
export const TIMING = {
  minClipSpacing: 60, // 2 seconds at 30fps
  transitionDuration: 30, // 1 second transition
} as const;

// Load audio durations for clips
export const loadAudioDurations = async (clips: any[]) => {
  const durations: { [key: number]: number } = {};
  
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
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
  
  return durations;
};

// Calculate total duration in frames
export const calculateDurationInFrames = (
  clips: any[],
  audioDurations: { [key: number]: number }
) => {
  const totalDuration = clips.reduce((total, clip, index) => {
    let clipDuration;
    if (clip.voiceAudio && audioDurations[index]) {
      // Use voice audio duration plus minimum spacing
      clipDuration = Math.round(audioDurations[index] * VIDEO_CONFIG.fps) + TIMING.minClipSpacing;
    } else {
      // Use default duration of 5 seconds plus minimum spacing for clips without audio
      clipDuration = 5 * VIDEO_CONFIG.fps + TIMING.minClipSpacing;
    }
    
    // For all clips except the first one, subtract transition overlap
    if (index > 0) {
      return total + clipDuration - TIMING.transitionDuration;
    }
    return total + clipDuration;
  }, 0);
  
  // Return at least 3 seconds duration
  return Math.max(totalDuration, 3 * VIDEO_CONFIG.fps);
}; 