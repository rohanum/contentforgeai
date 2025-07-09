'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating SEO-optimized YouTube descriptions.
 *
 * The flow takes a topic or script as input and generates a description including example links, aiming for high search ranking.
 * It now integrates with the user's Brand Kit for more personalized, brand-aware output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeDescriptionInputSchema = z.object({
  topic: z.string().describe('The topic of the YouTube video.'),
  script: z.string().optional().describe('The script of the YouTube video (optional).'),
  exampleLinks: z.string().optional().describe('Example links to include in the description (optional).'),
  // Brand Kit Integration
  brandName: z.string().optional().describe("The user's brand name."),
  brandDescription: z.string().optional().describe("A description of the user's brand."),
  keywords: z.array(z.string()).optional().describe("A list of keywords relevant to the user's brand."),
  toneOfVoice: z.string().optional().describe("The desired tone of voice for the brand."),
});
export type GenerateYoutubeDescriptionInput = z.infer<
  typeof GenerateYoutubeDescriptionInputSchema
>;

const GenerateYoutubeDescriptionOutputSchema = z.object({
  description: z.string().describe('The SEO-optimized YouTube description.'),
});
export type GenerateYoutubeDescriptionOutput = z.infer<
  typeof GenerateYoutubeDescriptionOutputSchema
>;

export async function generateYoutubeDescription(
  input: GenerateYoutubeDescriptionInput
): Promise<GenerateYoutubeDescriptionOutput> {
  return generateYoutubeDescriptionFlow(input);
}

const generateYoutubeDescriptionPrompt = ai.definePrompt({
  name: 'generateYoutubeDescriptionPrompt',
  input: {schema: GenerateYoutubeDescriptionInputSchema},
  output: {schema: GenerateYoutubeDescriptionOutputSchema},
  prompt: `You are an expert in creating SEO-optimized YouTube video descriptions.

  {{#if brandName}}
  You are writing on behalf of "{{brandName}}".
  Brand Description: {{brandDescription}}
  Brand Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Tone of Voice: {{toneOfVoice}}
  Use the brand information to ensure your output is consistent with the user's brand identity.
  {{/if}}

  Based on the provided topic and script (if available), create a compelling and SEO-friendly YouTube description.
  Include relevant keywords to improve search ranking.
  If example links are provided, format them appropriately within the description.

  Topic: {{{topic}}}
  Script: {{{script}}}
  Example Links: {{{exampleLinks}}}

  Description:`,
});

const generateYoutubeDescriptionFlow = ai.defineFlow(
  {
    name: 'generateYoutubeDescriptionFlow',
    inputSchema: GenerateYoutubeDescriptionInputSchema,
    outputSchema: GenerateYoutubeDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateYoutubeDescriptionPrompt(input);
    return output!;
  }
);
