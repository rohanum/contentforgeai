'use server';

/**
 * @fileOverview Generates timestamped video chapters from a script.
 *
 * - generateChapters - A function that handles the chapter generation process.
 * - GenerateChaptersInput - The input type for the generateChapters function.
 * - GenerateChaptersOutput - The return type for the generateChapters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChaptersInputSchema = z.object({
  script: z.string().describe('The full text of the video script.'),
});
export type GenerateChaptersInput = z.infer<typeof GenerateChaptersInputSchema>;

const ChapterSchema = z.object({
    timestamp: z.string().describe("The start time of the chapter in MM:SS format."),
    title: z.string().describe("A concise and descriptive title for the chapter."),
});

const GenerateChaptersOutputSchema = z.object({
  chapters: z.array(ChapterSchema).describe('An array of generated video chapters.'),
});
export type GenerateChaptersOutput = z.infer<typeof GenerateChaptersOutputSchema>;

export async function generateChapters(input: GenerateChaptersInput): Promise<GenerateChaptersOutput> {
  return generateChaptersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChaptersPrompt',
  input: {schema: GenerateChaptersInputSchema},
  output: {schema: GenerateChaptersOutputSchema},
  prompt: `You are an expert video editor who specializes in creating YouTube video chapters.

  Analyze the following video script and identify logical sections or topics. For each section, create a concise, compelling chapter title.
  
  Then, estimate the start time for each chapter in MM:SS format. Assume an average speaking rate of 150 words per minute to calculate the timestamps. The first chapter must always start at 00:00.

  Script:
  {{{script}}}
  `,
});

const generateChaptersFlow = ai.defineFlow(
  {
    name: 'generateChaptersFlow',
    inputSchema: GenerateChaptersInputSchema,
    outputSchema: GenerateChaptersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
