'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating YouTube video scripts from a given topic.
 *
 * - generateYoutubeScript - A function that generates a YouTube video script.
 * - GenerateYoutubeScriptInput - The input type for the generateYoutubeScript function.
 * - GenerateYoutubeScriptOutput - The return type for the generateYoutubeScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the YouTube video script.'),
  tone: z.string().optional().describe('The tone or style of the script (e.g., funny, informative, serious).'),
  scriptLength: z.enum(['short-form', 'long-form']).default('long-form').describe('The desired length of the script (short-form or long-form).'),
});
export type GenerateYoutubeScriptInput = z.infer<typeof GenerateYoutubeScriptInputSchema>;

const GenerateYoutubeScriptOutputSchema = z.object({
  script: z.string().describe('The generated YouTube video script.'),
});
export type GenerateYoutubeScriptOutput = z.infer<typeof GenerateYoutubeScriptOutputSchema>;

export async function generateYoutubeScript(input: GenerateYoutubeScriptInput): Promise<GenerateYoutubeScriptOutput> {
  return generateYoutubeScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYoutubeScriptPrompt',
  input: {schema: GenerateYoutubeScriptInputSchema},
  output: {schema: GenerateYoutubeScriptOutputSchema},
  prompt: `You are a YouTube scriptwriter expert. Generate a complete YouTube video script based on the given topic, considering the specified tone and script length.

Topic: {{{topic}}}
Tone: {{{tone}}}
Script Length: {{{scriptLength}}}

Script:
`,
});

const generateYoutubeScriptFlow = ai.defineFlow(
  {
    name: 'generateYoutubeScriptFlow',
    inputSchema: GenerateYoutubeScriptInputSchema,
    outputSchema: GenerateYoutubeScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
