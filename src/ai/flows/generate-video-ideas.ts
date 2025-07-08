'use server';

/**
 * @fileOverview Video idea generator flow.
 *
 * - generateVideoIdeas - A function that generates video ideas based on the user's niche.
 * - GenerateVideoIdeasInput - The input type for the generateVideoIdeas function.
 * - GenerateVideoIdeasOutput - The return type for the generateVideoIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoIdeasInputSchema = z.object({
  niche: z.string().describe('The niche or topic for which to generate video ideas.'),
  trendingTopics: z
    .string()
    .optional()
    .describe('Trending topics related to the niche. Optional.'),
  pastVideoTypes: z
    .string()
    .optional()
    .describe('Types of videos the user has created in the past. Optional.'),
});
export type GenerateVideoIdeasInput = z.infer<typeof GenerateVideoIdeasInputSchema>;

const GenerateVideoIdeasOutputSchema = z.object({
  videoIdeas: z.array(z.string()).describe('An array of video ideas.'),
});
export type GenerateVideoIdeasOutput = z.infer<typeof GenerateVideoIdeasOutputSchema>;

export async function generateVideoIdeas(input: GenerateVideoIdeasInput): Promise<GenerateVideoIdeasOutput> {
  return generateVideoIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoIdeasPrompt',
  input: {schema: GenerateVideoIdeasInputSchema},
  output: {schema: GenerateVideoIdeasOutputSchema},
  prompt: `You are a creative video idea generator for YouTube.

  Generate a list of video ideas based on the following niche, trending topics, and past video types.

  Niche: {{{niche}}}
  Trending Topics: {{{trendingTopics}}}
  Past Video Types: {{{pastVideoTypes}}}

  Video Ideas:`,
});

const generateVideoIdeasFlow = ai.defineFlow(
  {
    name: 'generateVideoIdeasFlow',
    inputSchema: GenerateVideoIdeasInputSchema,
    outputSchema: GenerateVideoIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
