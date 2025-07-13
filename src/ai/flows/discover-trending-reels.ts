'use server';
import { ai, configureUserGenkit } from '@/ai/genkit';
import { z } from 'genkit';

const DiscoverTrendingReelsInputSchema = z.object({
  topic: z.string().describe('The topic to find trending reels for.'),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type DiscoverTrendingReelsInput = z.infer<typeof DiscoverTrendingReelsInputSchema>;

const TrendSchema = z.object({
    title: z.string(),
    reason: z.string(),
    contentSuggestion: z.string(),
    popularity: z.enum(['Very Hot', 'Gaining Momentum', 'Niche-Specific']),
    suggestedCTA: z.string(),
});

const DiscoverTrendingReelsOutputSchema = z.object({
  trends: z.array(TrendSchema),
});
export type DiscoverTrendingReelsOutput = z.infer<typeof DiscoverTrendingReelsOutputSchema>;

export async function discoverTrendingReels(input: DiscoverTrendingReelsInput): Promise<DiscoverTrendingReelsOutput> {
  configureUserGenkit(input.apiKey);
  return discoverTrendingReelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discoverTrendingReelsPrompt',
  input: { schema: DiscoverTrendingReelsInputSchema },
  output: { schema: DiscoverTrendingReelsOutputSchema },
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
