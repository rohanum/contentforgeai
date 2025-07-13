'use server';
import { ai, configureUserGenkit } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCaptionInputSchema = z.object({
  topic: z.string(),
  tone: z.enum(['bold', 'chill', 'classy', 'funny']),
  platform: z.enum(['instagram', 'facebook', 'x', 'tiktok']),
  additionalEmojis: z.string().optional(),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type GenerateCaptionInput = z.infer<typeof GenerateCaptionInputSchema>;

const GenerateCaptionOutputSchema = z.object({
  caption: z.string(),
});
export type GenerateCaptionOutput = z.infer<typeof GenerateCaptionOutputSchema>;

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  configureUserGenkit(input.apiKey);
  return generateCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPrompt',
  input: { schema: GenerateCaptionInputSchema },
  output: { schema: GenerateCaptionOutputSchema },
  prompt: `Generate a {{tone}} caption for {{platform}} about {{topic}}. Emojis: {{additionalEmojis}}`
});

const generateCaptionFlow = ai.defineFlow(
  {
    name: 'generateCaptionFlow',
    inputSchema: GenerateCaptionInputSchema,
    outputSchema: GenerateCaptionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
