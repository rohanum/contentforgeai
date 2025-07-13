'use server';

/**
 * @fileOverview Generates a short-form video script for platforms like Instagram Reels.
 *
 * - generateReelScript - A function that handles the reel script generation process.
 * - GenerateReelScriptInput - The input type for the generateReelScript function.
 * - GenerateReelScriptOutput - The return type for the generateReelScript function.
 */

import {ai, configureUserGenkit} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReelScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the reel.'),
  trendingSong: z.string().optional().describe('The name of a trending song to incorporate.'),
  style: z.string().optional().describe('The style of the reel script (e.g., funny, informative, dramatic).'),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type GenerateReelScriptInput = z.infer<typeof GenerateReelScriptInputSchema>;

const GenerateReelScriptOutputSchema = z.object({
  script: z.string().describe('The generated reel script.'),
});
export type GenerateReelScriptOutput = z.infer<typeof GenerateReelScriptOutputSchema>;

export async function generateReelScript(input: GenerateReelScriptInput): Promise<GenerateReelScriptOutput> {
  configureUserGenkit(input.apiKey);
  return generateReelScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReelScriptPrompt',
  input: {schema: GenerateReelScriptInputSchema},
  output: {schema: GenerateReelScriptOutputSchema},
  prompt: `You are an expert in creating engaging short-form video scripts for platforms like Instagram Reels.

  Generate a script based on the following topic:
  {{topic}}

  {% if trendingSong %}Incorporate the trending song: {{trendingSong}}{% endif %}

  {% if style %}The script should be in a {{style}} style.{% endif %}

  The script should be between 15 and 60 seconds long.
  `,
});

const generateReelScriptFlow = ai.defineFlow(
  {
    name: 'generateReelScriptFlow',
    inputSchema: GenerateReelScriptInputSchema,
    outputSchema: GenerateReelScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
