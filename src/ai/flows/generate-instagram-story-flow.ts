// The file should be named generate-instagram-story-flow.ts
'use server';

/**
 * @fileOverview Generates a 3-5 frame Instagram story script for value, announcement, or brand storytelling.
 *
 * - generateInstagramStoryFlow - A function that generates the story flow.
 * - GenerateInstagramStoryFlowInput - The input type for the generateInstagramStoryFlow function.
 * - GenerateInstagramStoryFlowOutput - The return type for the generateInstagramStoryFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstagramStoryFlowInputSchema = z.object({
  topic: z.string().describe('The topic of the Instagram story.'),
  storyType: z
    .enum(['value', 'announcement', 'brand storytelling'])
    .describe('The type of story to generate.'),
});
export type GenerateInstagramStoryFlowInput = z.infer<
  typeof GenerateInstagramStoryFlowInputSchema
>;

const GenerateInstagramStoryFlowOutputSchema = z.object({
  storyFrames: z
    .array(z.string())
    .describe('An array of 3-5 story frames for the Instagram story.'),
});
export type GenerateInstagramStoryFlowOutput = z.infer<
  typeof GenerateInstagramStoryFlowOutputSchema
>;

export async function generateInstagramStoryFlow(
  input: GenerateInstagramStoryFlowInput
): Promise<GenerateInstagramStoryFlowOutput> {
  return generateInstagramStory(input);
}

const prompt = ai.definePrompt({
  name: 'generateInstagramStoryPrompt',
  input: {schema: GenerateInstagramStoryFlowInputSchema},
  output: {schema: GenerateInstagramStoryFlowOutputSchema},
  prompt: `You are an expert social media content creator.

  Generate a 3-5 frame Instagram story script for the topic "{{topic}}".
  The story should be a "{{storyType}}" story.

  Each frame should be short and engaging.
  Return an array of strings, where each string is a frame in the story.
  The output should be a JSON object with a single key "storyFrames" whose value is the array of strings. Do not include any other keys.
  Here is an example of the desired output format:
  {
    "storyFrames": [
      "Frame 1: [Content of frame 1]",
      "Frame 2: [Content of frame 2]",
      "Frame 3: [Content of frame 3]",
    ]
  }
  `,
});

const generateInstagramStory = ai.defineFlow(
  {
    name: 'generateInstagramStory',
    inputSchema: GenerateInstagramStoryFlowInputSchema,
    outputSchema: GenerateInstagramStoryFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

