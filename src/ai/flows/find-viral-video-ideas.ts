'use server';
/**
 * @fileOverview Finds viral YouTube video ideas with strategic analysis.
 *
 * - findViralVideoIdeas - A function that handles finding viral video ideas.
 * - FindViralVideoIdeasInput - The input type for the function.
 * - FindViralVideoIdeasOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindViralVideoIdeasInputSchema = z.object({
  niche: z.string().describe('The niche or topic to find viral video ideas for.'),
});
export type FindViralVideoIdeasInput = z.infer<typeof FindViralVideoIdeasInputSchema>;

const ViralVideoConceptSchema = z.object({
    title: z.string().describe("A click-worthy and SEO-friendly title for the video."),
    hook: z.string().describe("The first 15 seconds of the video script, designed to grab attention immediately."),
    coreValue: z.string().describe("A clear and concise summary of what the viewer will gain from watching."),
    format: z.string().describe("The style of the video (e.g., 'Documentary-style', 'Top 10 List', 'Challenge Video')."),
    uniqueness: z.string().describe("A brief explanation of what makes this video idea stand out from existing content."),
    monetizationAngle: z.string().describe("A suggested strategy for how this video could generate revenue (e.g., 'Affiliate links for gear', 'Promote own digital product')."),
});
export type ViralVideoConcept = z.infer<typeof ViralVideoConceptSchema>;

const FindViralVideoIdeasOutputSchema = z.object({
  concepts: z.array(ViralVideoConceptSchema).describe('An array of 3-5 viral video concepts, each with a full strategic breakdown.'),
});
export type FindViralVideoIdeasOutput = z.infer<typeof FindViralVideoIdeasOutputSchema>;

export async function findViralVideoIdeas(input: FindViralVideoIdeasInput): Promise<FindViralVideoIdeasOutput> {
  return findViralVideoIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findViralVideoIdeasPrompt',
  input: {schema: FindViralVideoIdeasInputSchema},
  output: {schema: FindViralVideoIdeasOutputSchema},
  prompt: `You are an expert YouTube strategist and viral content analyst. You have a deep understanding of what makes a video successful.

  Based on the provided niche, generate 3-5 distinct and highly promising viral video concepts. For each concept, you must provide a complete strategic breakdown.

  Niche: {{{niche}}}

  For each concept, provide:
  1.  **Title:** A highly engaging, click-worthy, and SEO-optimized title.
  2.  **Hook:** The script for the first 15 seconds, designed to maximize viewer retention.
  3.  **Core Value:** A simple, powerful statement of what the viewer will get out of the video.
  4.  **Format:** The specific format of the video (e.g., Documentary-style, Tutorial, Challenge, Top 10 List).
  5.  **Uniqueness:** What makes this idea different or better than what's already out there?
  6.  **Monetization Angle:** A practical suggestion for how this video could be monetized.
  `,
});

const findViralVideoIdeasFlow = ai.defineFlow(
  {
    name: 'findViralVideoIdeasFlow',
    inputSchema: FindViralVideoIdeasInputSchema,
    outputSchema: FindViralVideoIdeasOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
