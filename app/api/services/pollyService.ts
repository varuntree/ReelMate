import { PollyClient, SynthesizeSpeechCommand, OutputFormat, Engine, TextType, VoiceId } from "@aws-sdk/client-polly";

const client = new PollyClient({
  region: process.env['AWS_REGION'] || 'us-east-1',
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID']!,
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']!,
  },
});

export interface VoiceSettings {
  voiceId: VoiceId;
}

export const AVAILABLE_VOICES = {
  "English (US)": [
    { id: "Joanna", gender: "Female" },
    { id: "Joey", gender: "Male" },
    { id: "Justin", gender: "Male" },
    { id: "Kendra", gender: "Female" },
    { id: "Kimberly", gender: "Female" },
    { id: "Matthew", gender: "Male" },
    { id: "Salli", gender: "Female" },
    { id: "Kevin", gender: "Male" },
  ],
  "English (British)": [
    { id: "Amy", gender: "Female" },
    { id: "Brian", gender: "Male" },
    { id: "Emma", gender: "Female" },
  ],
  "English (Australian)": [
    { id: "Nicole", gender: "Female" },
    { id: "Russell", gender: "Male" },
  ],
  "English (Indian)": [
    { id: "Aditi", gender: "Female" },
  ],
  "English (South African)": [
    { id: "Ayanda", gender: "Female" },
  ],
} as const;

export async function synthesizeSpeech(
  text: string,
  settings: VoiceSettings = { voiceId: "Joey" }
) {
  const { voiceId } = settings;

  const params = {
    OutputFormat: "mp3" as OutputFormat,
    Text: text,
    TextType: "text" as TextType,
    VoiceId: voiceId,
    Engine: "neural" as Engine,
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const response = await client.send(command);

    if (!response.AudioStream) {
      throw new Error("No audio stream returned from Polly");
    }

    // Convert audio stream to Base64
    const audioBuffer = await response.AudioStream.transformToByteArray();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    return audioBase64;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
} 