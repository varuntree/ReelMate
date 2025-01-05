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

export interface TextClip {
  text: string;
  duration: number; // in seconds
  videoKeywords: string[]; // keywords for Pixabay video search
}

export interface ReelContent {
  theme: ReelTheme;
  clips: TextClip[];
  bgMusicKeywords: string[]; // keywords for background music search
  style: {
    tone: string; // e.g., 'professional', 'casual', 'energetic'
    pacing: 'slow' | 'medium' | 'fast';
  };
}

export interface GenerateReelContentRequest {
  prompt: string;
  theme?: ReelTheme; // optional, if not provided, AI will decide
  numberOfClips?: number; // optional, AI will determine optimal number if not provided
}

export interface GenerateReelContentResponse {
  content: ReelContent;
  error?: string;
} 