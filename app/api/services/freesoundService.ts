import axios from 'axios';

const FREESOUND_API_KEY = process.env['NEXT_PUBLIC_FREESOUND_API_KEY'];
const FREESOUND_API_URL = 'https://freesound.org/apiv2';

export interface FreesoundTrack {
  id: number;
  name: string;
  duration: number;
  username: string;
  previews: {
    'preview-hq-mp3': string;
    'preview-lq-mp3': string;
  };
  tags: string[];
}

export interface FreesoundResponse {
  count: number;
  results: FreesoundTrack[];
}

export const MUSIC_CATEGORIES = [
  { id: 'new-update', label: 'New & Update', keywords: 'upbeat corporate background' },
  { id: 'epic-dramatic', label: 'Epic & Dramatic', keywords: 'epic dramatic cinematic' },
  { id: 'happy-uplifting', label: 'Happy & Uplifting', keywords: 'happy uplifting cheerful' },
  { id: 'calm-relaxing', label: 'Calm & Relaxing', keywords: 'calm relaxing ambient' },
  { id: 'energetic', label: 'Energetic', keywords: 'energetic dynamic powerful' },
  { id: 'inspirational', label: 'Inspirational', keywords: 'inspirational motivational' },
] as const;

export async function searchFreesoundMusic(
  keywords: string,
  page: number = 1,
  pageSize: number = 5
): Promise<FreesoundResponse> {
  if (!FREESOUND_API_KEY) {
    throw new Error('Freesound API key is not configured');
  }

  try {
    const response = await axios.get(`${FREESOUND_API_URL}/search/text/`, {
      params: {
        token: FREESOUND_API_KEY,
        query: keywords + ' music',
        page,
        page_size: pageSize,
        fields: 'id,name,duration,username,previews,tags',
        filter: 'duration:[30 TO 180]', // Limit to tracks between 30s and 3min
      },
    });

    return response.data;
  } catch (error) {
    console.error('Freesound API Error:', error);
    throw new Error('Failed to fetch music from Freesound');
  }
} 