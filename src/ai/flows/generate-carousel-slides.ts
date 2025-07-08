'use server';

/**
 * @fileOverview Generates carousel slides from a topic with hooks, stories, value, and CTAs.
 *
 * - generateCarouselSlides - A function that handles the carousel slides generation.
 * - GenerateCarouselSlidesInput - The input type for the generateCarouselSlides function.
 * - GenerateCarouselSlidesOutput - The return type for the generateCarouselSlides function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCarouselSlidesInputSchema = z.object({
  topic: z.string().describe('The topic for the carousel.'),
  numSlides: z.number().describe('The number of slides to generate.'),
});
export type GenerateCarouselSlidesInput = z.infer<typeof GenerateCarouselSlidesInputSchema>;

const GenerateCarouselSlidesOutputSchema = z.object({
  slides: z.array(
    z.object({
      hook: z.string().describe('A compelling hook for the slide.'),
      story: z.string().describe('A story related to the topic for the slide.'),
      value: z.string().describe('The value provided to the user in the slide.'),
      cta: z.string().describe('A call to action for the slide.'),
    })
  ).describe('An array of carousel slides, each with a hook, story, value, and CTA.'),
});
export type GenerateCarouselSlidesOutput = z.infer<typeof GenerateCarouselSlidesOutputSchema>;

export async function generateCarouselSlides(input: GenerateCarouselSlidesInput): Promise<GenerateCarouselSlidesOutput> {
  return generateCarouselSlidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCarouselSlidesPrompt',
  input: {schema: GenerateCarouselSlidesInputSchema},
  output: {schema: GenerateCarouselSlidesOutputSchema},
  prompt: `You are an expert in creating engaging carousel content.

  Generate {{numSlides}} slides for a carousel on the topic of "{{{topic}}}". Each slide should contain a hook to grab the reader's attention, a story that relates to the topic, a value that the reader will gain, and a call to action to encourage engagement.

  Ensure each slide has these components:
  - **Hook:** An intriguing opening to capture attention.
  - **Story:** A relatable anecdote or narrative.
  - **Value:** A clear benefit or takeaway for the reader.
  - **CTA:** A prompt for the reader to take action (e.g., like, comment, share, save).

  Format the output as a JSON array of slides, where each slide is an object with 'hook', 'story', 'value', and 'cta' keys.

  Example:
  [
    {
      "hook": "Did you know that...",
      "story": "Once upon a time...",
      "value": "You'll learn how to...",
      "cta": "Double tap if you agree!"
    },
    ...
  ]
  `,
});

const generateCarouselSlidesFlow = ai.defineFlow(
  {
    name: 'generateCarouselSlidesFlow',
    inputSchema: GenerateCarouselSlidesInputSchema,
    outputSchema: GenerateCarouselSlidesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
