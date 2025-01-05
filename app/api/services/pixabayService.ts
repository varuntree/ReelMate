import axios from 'axios';

const PIXABAY_API_KEY = process.env['NEXT_PUBLIC_PIXABAY_API_KEY'];
const PIXABAY_API_URL = 'https://pixabay.com/api/videos/';

export interface PixabayVideo {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  picture_id: string;
  videos: {
    large: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    small: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    tiny: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
  };
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayVideoResponse {
  total: number;
  totalHits: number;
  hits: PixabayVideo[];
}

export async function searchPixabayVideos(
  keywords: string,
  page: number = 1,
  perPage: number = 20
): Promise<PixabayVideoResponse> {
  if (!PIXABAY_API_KEY) {
    throw new Error('Pixabay API key is not configured');
  }

  try {
    const response = await axios.get(PIXABAY_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: keywords,
        page,
        per_page: perPage,
        safesearch: true,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Pixabay API Error:', error);
    throw new Error('Failed to fetch videos from Pixabay');
  }
} 