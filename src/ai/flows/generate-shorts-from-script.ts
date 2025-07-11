'use server';
/**
 * @fileOverview Repurposes a long-form video script into multiple short-form video ideas.
 *
 * - generateShortsFromScript - A function that handles the script to shorts generation.
 * - GenerateShortsFromScriptInput - The input type for the function.
 * - GenerateShortsFromScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShortsFromScriptInputSchema = z.object({
  script: z.string().min(100).describe('The long-form video script to be repurposed.'),
});
export type GenerateShortsFromScriptInput = z.infer<typeof GenerateShortsFromScriptInputSchema>;

const ShortIdeaSchema = z.object({
    hook: z.string().describe("A powerful, attention-grabbing hook for the short video (under 10 words)."),
    title: z.string().describe("A concise title for the short video."),
    script_segment: z.string().describe("A key, self-contained segment from the original script that delivers value quickly."),
    cta: z.string().describe("A clear call-to-action prompting viewers to watch the full video on YouTube."),
});

const GenerateShortsFromScriptOutputSchema = z.object({
  shorts: z.array(ShortIdeaSchema).describe('An array of 3-5 short-form video ideas.'),
});
export type GenerateShortsFromScriptOutput = z.infer<typeof GenerateShortsFromScriptOutputSchema>;

export async function generateShortsFromScript(input: GenerateShortsFromScriptInput): Promise<GenerateShortsFromScriptOutput> {
  return generateShortsFromScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShortsFromScriptPrompt',
  input: {schema: GenerateShortsFromScriptInputSchema},
  output: {schema: GenerateShortsFromScriptOutputSchema},
  prompt: `You are an expert viral video producer who specializes in repurposing long-form YouTube content into engaging short-form videos (like YouTube Shorts, Instagram Reels, and TikToks).

  Your task is to analyze the following long-form video script and extract 3-5 of the most compelling, self-contained moments or ideas that can stand alone as valuable short videos.

  For each idea, you must generate:
  1.  **Hook:** A powerful, attention-grabbing opening line (under 10 words) to stop the scroll.
  2.  **Title:** A concise, intriguing title for the short video.
  3.  **Script Segment:** The most relevant, impactful segment from the original script. It should be concise and deliver a complete thought or piece of value.
  4.  **CTA:** A clear call-to-action that directs the viewer to the full video, for example: "Watch the full video for more details! Link in bio."

  Long-form script to analyze:
  {{{script}}}
  `,
});

const generateShortsFromScriptFlow = ai.defineFlow(
  {
    name: 'generateShortsFromScriptFlow',
    inputSchema: GenerateShortsFromScriptInputSchema,
    outputSchema: GenerateShortsFromScriptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
