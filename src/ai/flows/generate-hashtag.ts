// src/ai/flows/generate-hashtag.ts
'use server';
/**
 * @fileOverview A hashtag generation AI agent.
 *
 * - generateHashtag - A function that handles the hashtag generation process.
 * - GenerateHashtagInput - The input type for the generateHashtag function.
 * - GenerateHashtagOutput - The return type for the generateHashtag function.
 */

import {ai, configureUserGenkit} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHashtagInputSchema = z.object({
  topic: z.string().describe('The topic or theme of the content.'),
  tone: z
    .string()
    .optional()
    .describe('The desired tone or style of the hashtags (e.g., funny, serious, trendy).'),
  popularityLevels: z
    .array(z.enum(['low', 'medium', 'viral']))
    .optional()
    .default(['low', 'medium', 'viral'])
    .describe('The desired popularity levels of hashtags to generate (low, medium, viral).'),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type GenerateHashtagInput = z.infer<typeof GenerateHashtagInputSchema>;

const GenerateHashtagOutputSchema = z.object({
  hashtags: z.object({
    low: z.array(z.string()).describe('Low popularity hashtags.'),
    medium: z.array(z.string()).describe('Medium popularity hashtags.'),
    viral: z.array(z.string()).describe('Viral hashtags.'),
  }),
});
export type GenerateHashtagOutput = z.infer<typeof GenerateHashtagOutputSchema>;

export async function generateHashtag(input: GenerateHashtagInput): Promise<GenerateHashtagOutput> {
  configureUserGenkit(input.apiKey);
  return generateHashtagFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHashtagPrompt',
  input: {schema: GenerateHashtagInputSchema},
  output: {schema: GenerateHashtagOutputSchema},
  prompt: `You are an expert social media manager specializing in hashtag generation.

You will generate hashtags based on the provided topic, tone, and desired popularity levels.

Topic: {{{topic}}}
Tone: {{{tone}}}
Popularity Levels: {{{popularityLevels}}}

Generate hashtags grouped by popularity: low, medium, and viral.
`,
});

const generateHashtagFlow = ai.defineFlow(
  {
    name: 'generateHashtagFlow',
    inputSchema: GenerateHashtagInputSchema,
    outputSchema: GenerateHashtagOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
