'use server';
import { ai, configureUserGenkit } from '@/ai/genkit';
import { z } from 'genkit';

const ConvertVideoToScriptInputSchema = z.object({
  youtubeUrl: z.string().describe('The URL of the YouTube video.'),
  tone: z.string().describe('The desired tone of the rewritten script.'),
  apiKey: z.string().describe("The user's Gemini API key."),
});
export type ConvertVideoToScriptInput = z.infer<typeof ConvertVideoToScriptInputSchema>;

const ConvertVideoToScriptOutputSchema = z.object({
  script: z.string().describe('The converted and rewritten script of the video.'),
});
export type ConvertVideoToScriptOutput = z.infer<typeof ConvertVideoToScriptOutputSchema>;

export async function convertVideoToScript(input: ConvertVideoToScriptInput): Promise<ConvertVideoToScriptOutput> {
  configureUserGenkit(input.apiKey);
  return convertVideoToScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertVideoToScriptPrompt',
  input: { schema: ConvertVideoToScriptInputSchema },
  output: { schema: ConvertVideoToScriptOutputSchema },
  prompt: `You are an expert video scripter who rewrites transcripts in given tones.
  Rewrite the script from this YouTube video transcript in a {{tone}} tone:
  Youtube URL: {{{youtubeUrl}}}
  Rewritten Script:`,
});

const convertVideoToScriptFlow = ai.defineFlow(
  {
    name: 'convertVideoToScriptFlow',
    inputSchema: ConvertVideoToScriptInputSchema,
    outputSchema: ConvertVideoToScriptOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
