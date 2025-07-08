'use server';

/**
 * @fileOverview Generates clickbait-friendly YouTube titles from a topic.
 *
 * - generateYoutubeTitle - A function that generates YouTube titles.
 * - GenerateYoutubeTitleInput - The input type for the generateYoutubeTitle function.
 * - GenerateYoutubeTitleOutput - The return type for the generateYoutubeTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeTitleInputSchema = z.object({
  topic: z.string().describe('The topic of the YouTube video.'),
});
export type GenerateYoutubeTitleInput = z.infer<typeof GenerateYoutubeTitleInputSchema>;

const GenerateYoutubeTitleOutputSchema = z.object({
  titles: z.array(z.string()).describe('An array of clickbait-friendly YouTube titles.'),
});
export type GenerateYoutubeTitleOutput = z.infer<typeof GenerateYoutubeTitleOutputSchema>;

export async function generateYoutubeTitle(input: GenerateYoutubeTitleInput): Promise<GenerateYoutubeTitleOutput> {
  return generateYoutubeTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYoutubeTitlePrompt',
  input: {schema: GenerateYoutubeTitleInputSchema},
  output: {schema: GenerateYoutubeTitleOutputSchema},
  prompt: `You are an expert in generating clickbait-friendly YouTube titles.

  Generate 5 different titles based on the following topic:
  {{topic}}

  The titles should be engaging, attention-grabbing, and optimized to increase viewership.
  Include variants with emotion, questions, and listicles.
  Format the output as a JSON array of strings.
  `,
});

const generateYoutubeTitleFlow = ai.defineFlow(
  {
    name: 'generateYoutubeTitleFlow',
    inputSchema: GenerateYoutubeTitleInputSchema,
    outputSchema: GenerateYoutubeTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
