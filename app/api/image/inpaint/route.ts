import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: 'REPLICATE_API_TOKEN is not configured' },
      { status: 500 }
    );
  }

  try {
    const { image, mask, prompt } = await request.json();

    // Convert base64 to clean format by removing data URL prefix if present
    const cleanBase64Image = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const cleanBase64Mask = mask.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    // Create data URLs in the format expected by Replicate
    const imageUrl = `data:image/png;base64,${cleanBase64Image}`;
    const maskUrl = `data:image/png;base64,${cleanBase64Mask}`;

    console.log('Starting image processing...');
    console.log('Prompt:', prompt);

    // Run the model with prediction
    const prediction = await replicate.predictions.create({
      version: "2a129764-4575-4916-9669-a3ec188e9375",
      input: {
        image: imageUrl,
        mask: maskUrl,
        prompt,
        steps: 50,
        guidance: 4.5,
        output_format: "jpg",
        safety_tolerance: 2,
        prompt_upsampling: true
      }
    });

    // Wait for the prediction to complete
    const finalPrediction = await replicate.wait(prediction);
    console.log('Processing complete, output:', finalPrediction);

    if (!finalPrediction.output) {
      throw new Error('No output received from the model');
    }

    // The output will be a URL to the generated image
    return NextResponse.json({ output: finalPrediction.output });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    );
  }
} 