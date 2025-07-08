'use server';
/**
 * @fileOverview Converts a YouTube video into a script and rewrites the tone.
 *
 * - convertVideoToScript - A function that handles the video to script conversion process.
 * - ConvertVideoToScriptInput - The input type for the convertVideoToScript function.
 * - ConvertVideoToScriptOutput - The return type for the convertVideoToScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertVideoToScriptInputSchema = z.object({
  youtubeUrl: z.string().describe('The URL of the YouTube video.'),
  tone: z.string().describe('The desired tone of the rewritten script (e.g., funny, informative, story).'),
});
export type ConvertVideoToScriptInput = z.infer<typeof ConvertVideoToScriptInputSchema>;

const ConvertVideoToScriptOutputSchema = z.object({
  script: z.string().describe('The converted and rewritten script of the video.'),
});
export type ConvertVideoToScriptOutput = z.infer<typeof ConvertVideoToScriptOutputSchema>;

export async function convertVideoToScript(input: ConvertVideoToScriptInput): Promise<ConvertVideoToScriptOutput> {
  return convertVideoToScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertVideoToScriptPrompt',
  input: {schema: ConvertVideoToScriptInputSchema},
  output: {schema: ConvertVideoToScriptOutputSchema},
  prompt: `You are an expert video scripter who is able to rewrite the transcript of a video in a given tone.

  Rewrite the script from the following YouTube video transcript, adopting the tone specified by the user. 
  Ensure the rewritten script is clear, engaging, and maintains the original content's core message, rephrasing it into a {{tone}} tone.
  Youtube URL: {{{youtubeUrl}}}
  Tone: {{{tone}}}

  Rewritten Script:`, // No need to include <title> because URLs don't work for that
});

const convertVideoToScriptFlow = ai.defineFlow(
  {
    name: 'convertVideoToScriptFlow',
    inputSchema: ConvertVideoToScriptInputSchema,
    outputSchema: ConvertVideoToScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
