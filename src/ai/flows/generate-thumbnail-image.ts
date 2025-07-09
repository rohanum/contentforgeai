'use server';

/**
 * @fileOverview Generates multiple YouTube thumbnail images from a topic and style.
 * - generateThumbnailImage - A function that handles thumbnail image generation.
 * - GenerateThumbnailImageInput - The input type for the function.
 * - GenerateThumbnailImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateThumbnailImageInputSchema = z.object({
  topic: z.string().describe('The topic or title of the YouTube video.'),
  style: z
    .string()
    .describe(
      'The desired artistic style for the thumbnail (e.g., Bold & Contrasting, Minimalist & Clean).'
    ),
});
export type GenerateThumbnailImageInput = z.infer<
  typeof GenerateThumbnailImageInputSchema
>;

const GenerateThumbnailImageOutputSchema = z.object({
  images: z
    .array(
      z
        .string()
        .describe('A data URI of a generated thumbnail image. Expected format: \'data:image/png;base64,<encoded_data>\'.')
    )
    .describe('An array of generated thumbnail image data URIs.'),
});
export type GenerateThumbnailImageOutput = z.infer<
  typeof GenerateThumbnailImageOutputSchema
>;

export async function generateThumbnailImage(
  input: GenerateThumbnailImageInput
): Promise<GenerateThumbnailImageOutput> {
  return generateThumbnailImageFlow(input);
}

const generateThumbnailImageFlow = ai.defineFlow(
  {
    name: 'generateThumbnailImageFlow',
    inputSchema: GenerateThumbnailImageInputSchema,
    outputSchema: GenerateThumbnailImageOutputSchema,
  },
  async (input) => {
    const NUM_IMAGES = 3;
    const generationPromises = [];

    const prompt = `Generate a visually striking YouTube thumbnail for a video about "${input.topic}".
    The style should be: ${input.style}.
    The image must be eye-catching, high-resolution (1280x720 aspect ratio), and have clear areas where title text could be added later.
    IMPORTANT: Do NOT include any text in the image itself. The image should be a background composition.`;

    for (let i = 0; i < NUM_IMAGES; i++) {
      generationPromises.push(
        ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        })
      );
    }

    const results = await Promise.all(generationPromises);

    const images = results.map((result) => {
      if (!result.media) {
        throw new Error('Image generation failed to return media.');
      }
      return result.media.url;
    });

    return { images };
  }
);
