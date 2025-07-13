'use server';

/**
 * @fileOverview Discovers trending Reels and provides content suggestions.
 *
 * - discoverTrendingReels - A function that handles the trend discovery process.
 * - DiscoverTrendingReelsInput - The input type for the discoverTrendingReels function.
 * - DiscoverTrendingReelsOutput - The return type for the discoverTrendingReels function.
 */

import {ai, configureUserGenkit} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverTrendingReelsInputSchema = z.object({
  topic: z.string().describe('The topic or niche to find trending reels for.'),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type DiscoverTrendingReelsInput = z.infer<typeof DiscoverTrendingReelsInputSchema>;

const TrendSchema = z.object({
    title: z.string().describe('The title or name of the trending audio or reel format.'),
    reason: z.string().describe("A brief explanation of why this is currently trending."),
    contentSuggestion: z.string().describe("A specific content idea for the user's topic using this trend."),
    popularity: z.enum(['Very Hot', 'Gaining Momentum', 'Niche-Specific']).describe("An assessment of the trend's current popularity: 'Very Hot' for viral trends, 'Gaining Momentum' for rising trends, or 'Niche-Specific' for trends popular within a certain community."),
    suggestedCTA: z.string().describe("A specific call-to-action to encourage audience engagement with the reel."),
});
export type Trend = z.infer<typeof TrendSchema>;


const DiscoverTrendingReelsOutputSchema = z.object({
  trends: z.array(TrendSchema).describe('An array of 3-5 trending reels with content suggestions.'),
});
export type DiscoverTrendingReelsOutput = z.infer<typeof DiscoverTrendingReelsOutputSchema>;

export async function discoverTrendingReels(input: DiscoverTrendingReelsInput): Promise<DiscoverTrendingReelsOutput> {
  configureUserGenkit(input.apiKey);
  return discoverTrendingReelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discoverTrendingReelsPrompt',
  input: {schema: DiscoverTrendingReelsInputSchema},
  output: {schema: DiscoverTrendingReelsOutputSchema},
  prompt: `You are an expert social media strategist who is an expert at identifying trending audio and content on Instagram Reels.

  Based on the provided topic, identify 3-5 current trending Reels or audio formats.
  
  For each trend, provide:
  1.  A title for the trend (e.g., the name of the song, the meme format).
  2.  A brief reason why it's currently popular or how it's being used.
  3.  A specific, actionable content idea for how the user can apply this trend to their own content on the given topic.
  4.  A popularity rating ('Very Hot', 'Gaining Momentum', or 'Niche-Specific').
  5.  A suggested Call to Action (CTA) for the content idea.

  Topic: {{{topic}}}
  `,
});

const discoverTrendingReelsFlow = ai.defineFlow(
  {
    name: 'discoverTrendingReelsFlow',
    inputSchema: DiscoverTrendingReelsInputSchema,
    outputSchema: DiscoverTrendingReelsOutputSchema,
  },
  async (input) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { output } = await prompt(input);
        return output!;
      } catch (error) {
        const errorMessage = String(error);
        if (
          (errorMessage.includes('503') || errorMessage.includes('overloaded')) &&
          attempt < MAX_RETRIES
        ) {
          console.log(`Attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS * attempt}ms...`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        } else {
          // Non-retryable error or max retries reached
          throw error;
        }
      }
    }
    // This should not be reachable due to the throw in the catch block, but included for type safety.
    throw new Error('Failed to discover trending reels after multiple attempts.');
  }
); },
  prompt: `You are an expert social media strategist. Identify 3-5 current trending Reels or audio formats for topic: {{{topic}}}`
});

const discoverTrendingReelsFlow = ai.defineFlow(
  {
    name: 'discoverTrendingReelsFlow',
    inputSchema: DiscoverTrendingReelsInputSchema,
    outputSchema: DiscoverTrendingReelsOutputSchema,
  },
  async (input) => {
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { output } = await prompt(input);
        return output!;
      } catch (error) {
        if (attempt >= MAX_RETRIES) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('Failed after multiple attempts');
  }
);
