'use server';
/**
 * @fileOverview A text-to-speech AI flow for generating voiceovers.
 *
 * - generateVoiceover - A function that handles the voiceover generation process.
 * - GenerateVoiceoverInput - The input type for the generateVoiceover function.
 * - GenerateVoiceoverOutput - The return type for the generateVoiceover function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateVoiceoverInputSchema = z.object({
  script: z.string().describe('The text to be converted to speech.'),
});
export type GenerateVoiceoverInput = z.infer<typeof GenerateVoiceoverInputSchema>;

const GenerateVoiceoverOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated WAV audio file.'),
});
export type GenerateVoiceoverOutput = z.infer<typeof GenerateVoiceoverOutputSchema>;

export async function generateVoiceover(input: GenerateVoiceoverInput): Promise<GenerateVoiceoverOutput> {
  return generateVoiceoverFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const generateVoiceoverFlow = ai.defineFlow(
  {
    name: 'generateVoiceoverFlow',
    inputSchema: GenerateVoiceoverInputSchema,
    outputSchema: GenerateVoiceoverOutputSchema,
  },
  async ({script}) => {
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: script,
    });
    if (!media) {
      throw new Error('No audio media was returned from the model.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioUrl: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
