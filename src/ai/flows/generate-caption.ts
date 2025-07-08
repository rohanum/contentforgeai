// src/ai/flows/generate-caption.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating captions with different tone presets.
 *
 * - generateCaption - A function that generates captions based on input parameters.
 * - GenerateCaptionInput - The input type for the generateCaption function.
 * - GenerateCaptionOutput - The return type for the generateCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionInputSchema = z.object({
  topic: z.string().describe('The topic of the post.'),
  tone: z
    .enum(['bold', 'chill', 'classy', 'funny'])
    .describe('The desired tone of the caption.'),
  platform: z
    .enum(['instagram', 'facebook', 'x', 'tiktok'])
    .describe('The social media platform for the caption.'),
  additionalEmojis: z.string().optional().describe('Emojis to add to the caption.'),
});
export type GenerateCaptionInput = z.infer<typeof GenerateCaptionInputSchema>;

const GenerateCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated caption.'),
});
export type GenerateCaptionOutput = z.infer<typeof GenerateCaptionOutputSchema>;

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  return generateCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPrompt',
  input: {schema: GenerateCaptionInputSchema},
  output: {schema: GenerateCaptionOutputSchema},
  prompt: `You are an expert social media manager. Generate a compelling caption for a {{platform}} post about {{topic}} with a {{tone}} tone.

Include these emojis if provided: {{additionalEmojis}}

Caption:`,
});

const generateCaptionFlow = ai.defineFlow(
  {
    name: 'generateCaptionFlow',
    inputSchema: GenerateCaptionInputSchema,
    outputSchema: GenerateCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
