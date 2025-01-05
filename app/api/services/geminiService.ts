import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  type GenerateReelContentRequest,
  type GenerateReelContentResponse,
  type ReelContent,
} from '@/app/types/api';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env['GOOGLE_GEMINI_API_KEY'] || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Structured prompt for generating reel content
const REEL_CONTENT_PROMPT = `You are an AI assistant specialized in creating engaging social media reel content.
Given a user's prompt and optional theme, generate a structured reel content plan.

Guidelines:
- First clip should be attention-grabbing and clickbait-worthy
- Last clip should encourage following/engagement
- Each clip's text should be concise (one sentence)
- Include relevant keywords for background video search
- Suggest appropriate background music style
- Maintain consistent tone and pacing throughout

Available themes:
- Tutorials and How-To Videos
- Behind-the-Scenes (BTS)
- Travel and Adventure
- Product Showcases
- Facts and Education
- Motivational Content
- Storytelling
- Aesthetic Content
- Time-Lapse
- Memes and Trends

Please provide the response in the following JSON structure:
{
  "theme": string,
  "clips": [
    {
      "text": string,
      "duration": number,
      "videoKeywords": string[]
    }
  ],
  "bgMusicKeywords": string[],
  "style": {
    "tone": string,
    "pacing": "slow" | "medium" | "fast"
  }
}`;

export async function generateReelContent({
  prompt,
  theme,
  numberOfClips = 5,
}: GenerateReelContentRequest): Promise<GenerateReelContentResponse> {
  try {
    // Construct the complete prompt
    const fullPrompt = `${REEL_CONTENT_PROMPT}

User's Prompt: ${prompt}
${theme ? `Requested Theme: ${theme}` : 'Theme: Choose the most appropriate theme'}
Number of Clips: ${numberOfClips}

Generate the reel content plan:`;

    // Generate content using Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const content = JSON.parse(text) as ReelContent;
      return { content };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return {
        error: 'Failed to parse AI response',
        content: createDefaultReelContent(prompt, theme, numberOfClips),
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      error: 'Failed to generate reel content',
      content: createDefaultReelContent(prompt, theme, numberOfClips),
    };
  }
}

// Fallback function to create default reel content if API fails
function createDefaultReelContent(
  prompt: string,
  theme?: string,
  numberOfClips: number = 5
): ReelContent {
  return {
    theme: (theme as ReelContent['theme']) || 'custom',
    clips: [
      {
        text: `🔥 Discover amazing ${prompt}!`,
        duration: 3,
        videoKeywords: [prompt, 'intro', 'attention-grabbing'],
      },
      ...Array(numberOfClips - 2).fill(null).map((_, i) => ({
        text: `Interesting fact #${i + 1} about ${prompt}`,
        duration: 5,
        videoKeywords: [prompt, 'background', 'generic'],
      })),
      {
        text: '👉 Follow for more amazing content!',
        duration: 3,
        videoKeywords: ['outro', 'call-to-action', 'engaging'],
      },
    ],
    bgMusicKeywords: ['upbeat', 'energetic', 'background'],
    style: {
      tone: 'casual',
      pacing: 'medium',
    },
  };
} 