// Types for API responses and requests

export type ReelTheme =
  | 'tutorial'
  | 'behindTheScenes'
  | 'travel'
  | 'productShowcase'
  | 'facts'
  | 'motivational'
  | 'educational'
  | 'storytelling'
  | 'aesthetic'
  | 'timeLapse'
  | 'memes'
  | 'custom';

export type BgMusicCategory =
  | 'ambient'
  | 'upbeat'
  | 'cinematic'
  | 'electronic'
  | 'acoustic'
  | 'inspirational'
  | 'energetic'
  | 'relaxing'
  | 'dramatic'
  | 'happy';

export interface TextClip {
  text: string;
  duration: number; // in seconds
  videoKeywords: string[]; // keywords for Pixabay video search
  video?: {
    id: number;
    url: string;
    duration: number;
  };
  voiceAudio?: string; // base64 audio data URL
}

export interface ReelContent {
  theme: ReelTheme;
  clips: TextClip[];
  bgMusicKeywords: string[]; // keywords for background music search
  bgMusicCategory: BgMusicCategory; // category for background music
  style: {
    tone: string; // e.g., 'professional', 'casual', 'energetic'
    pacing: 'slow' | 'medium' | 'fast';
  };
}

export interface GenerateReelContentRequest {
  prompt: string;
  theme?: ReelTheme; // optional, if not provided, AI will decide
  numberOfClips?: number; // optional, AI will determine optimal number if not provided
  includeBgMusicCategory?: boolean; // whether to include background music category in response
}

export interface GenerateReelContentResponse {
  content: ReelContent;
  error?: string;
} 