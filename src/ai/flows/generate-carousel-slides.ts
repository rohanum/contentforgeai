'use server';
import { ai, configureUserGenkit } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCarouselSlidesInputSchema = z.object({
  topic: z.string(),
  numSlides: z.number(),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type GenerateCarouselSlidesInput = z.infer<typeof GenerateCarouselSlidesInputSchema>;

const GenerateCarouselSlidesOutputSchema = z.object({
  slides: z.array(
    z.object({
      hook: z.string(),
      story: z.string(),
      value: z.string(),
      cta: z.string(),
    })
  ),
});
export type GenerateCarouselSlidesOutput = z.infer<typeof GenerateCarouselSlidesOutputSchema>;

export async function generateCarouselSlides(input: GenerateCarouselSlidesInput): Promise<GenerateCarouselSlidesOutput> {
  configureUserGenkit(input.apiKey);
  return generateCarouselSlidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCarouselSlidesPrompt',
  input: { schema: GenerateCarouselSlidesInputSchema },
  output: { schema: GenerateCarouselSlidesOutputSchema },
  prompt: `Generate {{numSlides}} carousel slides about "{{{topic}}}". Each slide should contain hook, story, value, and CTA.`
});

const generateCarouselSlidesFlow = ai.defineFlow(
  {
    name: 'generateCarouselSlidesFlow',
    inputSchema: GenerateCarouselSlidesInputSchema,
    outputSchema: GenerateCarouselSlidesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
