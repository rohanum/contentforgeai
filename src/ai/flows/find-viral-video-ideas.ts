'use server';
import { ai, configureUserGenkit } from '@/ai/genkit';
import { z } from 'genkit';

const FindViralVideoIdeasInputSchema = z.object({
  niche: z.string().describe('The niche to find viral video ideas for.'),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type FindViralVideoIdeasInput = z.infer<typeof FindViralVideoIdeasInputSchema>;

const ViralVideoConceptSchema = z.object({
    title: z.string(),
    hook: z.string(),
    coreValue: z.string(),
    format: z.string(),
    uniqueness: z.string(),
    monetizationAngle: z.string(),
});

const FindViralVideoIdeasOutputSchema = z.object({
  concepts: z.array(ViralVideoConceptSchema),
});
export type FindViralVideoIdeasOutput = z.infer<typeof FindViralVideoIdeasOutputSchema>;

export async function findViralVideoIdeas(input: FindViralVideoIdeasInput): Promise<FindViralVideoIdeasOutput> {
  configureUserGenkit(input.apiKey);
  return findViralVideoIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findViralVideoIdeasPrompt',
  input: { schema: FindViralVideoIdeasInputSchema },
  output: { schema: FindViralVideoIdeasOutputSchema },
  prompt: `You are an expert YouTube strategist. Generate 3-5 viral video concepts for niche: {{{niche}}}`
});

const findViralVideoIdeasFlow = ai.defineFlow(
  {
    name: 'findViralVideoIdeasFlow',
    inputSchema: FindViralVideoIdeasInputSchema,
    outputSchema: FindViralVideoIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
