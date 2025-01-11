import axios from 'axios';

const PEXELS_API_KEY = process.env['NEXT_PUBLIC_PEXELS_API_KEY'];
const PEXELS_API_URL = 'https://api.pexels.com/videos/search';

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
}

export interface PexelsVideoResponse {
  total_results: number;
  page: number;
  per_page: number;
  videos: PexelsVideo[];
}

export async function searchPexelsVideos(
  keywords: string,
  page: number = 1,
  perPage: number = 20
): Promise<PexelsVideoResponse> {
  if (!PEXELS_API_KEY) {
    throw new Error('Pexels API key is not configured');
  }

  try {
    const response = await axios.get(PEXELS_API_URL, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: keywords,
        page,
        per_page: perPage,
        orientation: 'portrait',
        size: 'medium'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Pexels API Error:', error);
    throw new Error('Failed to fetch videos from Pexels');
  }
} 