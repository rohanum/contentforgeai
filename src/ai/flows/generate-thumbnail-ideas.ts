'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating thumbnail ideas from a topic.
 *
 * The flow takes a topic as input and returns a list of thumbnail ideas, including suggested text, colors, and emotion ideas.
 * It utilizes the DeepSeek model via a Genkit prompt to generate the ideas.
 *
 * @exports {
 *   generateThumbnailIdeas: (input: string) => Promise<string[]> - A function that generates thumbnail ideas for a given topic.
 *   GenerateThumbnailIdeasInput: string - The input type for the generateThumbnailIdeas function (a topic string).
 *   GenerateThumbnailIdeasOutput: string[] - The output type for the generateThumbnailIdeas function (an array of thumbnail idea strings).
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThumbnailIdeasInputSchema = z
  .string()
  .describe('The topic for which to generate thumbnail ideas.');
export type GenerateThumbnailIdeasInput = z.infer<
  typeof GenerateThumbnailIdeasInputSchema
>;

const GenerateThumbnailIdeasOutputSchema = z.array(z.string()).describe(
  'An array of thumbnail ideas, including suggested text, colors, and emotion ideas.'
);
export type GenerateThumbnailIdeasOutput = z.infer<
  typeof GenerateThumbnailIdeasOutputSchema
>;

export async function generateThumbnailIdeas(
  input: GenerateThumbnailIdeasInput
): Promise<GenerateThumbnailIdeasOutput> {
  return generateThumbnailIdeasFlow(input);
}

const generateThumbnailIdeasPrompt = ai.definePrompt({
  name: 'generateThumbnailIdeasPrompt',
  input: {schema: GenerateThumbnailIdeasInputSchema},
  output: {schema: GenerateThumbnailIdeasOutputSchema},
  prompt: `You are an expert in creating engaging YouTube thumbnails.
  Generate a list of thumbnail ideas for the following topic. For each idea, suggest bold thumbnail text, colors, and emotion ideas. 
  Return an array of strings, each string representing a thumbnail idea.

  Topic: {{{input}}}
  `,
});

const generateThumbnailIdeasFlow = ai.defineFlow(
  {
    name: 'generateThumbnailIdeasFlow',
    inputSchema: GenerateThumbnailIdeasInputSchema,
    outputSchema: GenerateThumbnailIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateThumbnailIdeasPrompt(input);
    return output!;
  }
);
