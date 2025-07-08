// src/ai/flows/improve-script.ts
'use server';
/**
 * @fileOverview A script improving AI agent.
 *
 * - improveScript - A function that handles the script improvement process.
 * - ImproveScriptInput - The input type for the improveScript function.
 * - ImproveScriptOutput - The return type for the improveScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveScriptInputSchema = z.object({
  script: z.string().describe('The script to be improved.'),
  tone: z.string().optional().describe('The desired tone of the improved script (e.g., funny, informative, story).'),
});
export type ImproveScriptInput = z.infer<typeof ImproveScriptInputSchema>;

const ImproveScriptOutputSchema = z.object({
  improvedScript: z.string().describe('The improved script with enhanced clarity and flow.'),
});
export type ImproveScriptOutput = z.infer<typeof ImproveScriptOutputSchema>;

export async function improveScript(input: ImproveScriptInput): Promise<ImproveScriptOutput> {
  return improveScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveScriptPrompt',
  input: {schema: ImproveScriptInputSchema},
  output: {schema: ImproveScriptOutputSchema},
  prompt: `You are an expert scriptwriter, skilled at improving the clarity, emotion, and flow of existing scripts.

  Please improve the following script. Pay close attention to clarity and flow. If a tone is specified, ensure that the output follows it.

  Script: {{{script}}}
  {{#if tone}}
  Tone: {{{tone}}}
  {{/if}}`,
});

const improveScriptFlow = ai.defineFlow(
  {
    name: 'improveScriptFlow',
    inputSchema: ImproveScriptInputSchema,
    outputSchema: ImproveScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
