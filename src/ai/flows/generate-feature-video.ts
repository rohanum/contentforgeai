'use server';

/**
 * @fileOverview Generates a complete video production kit from a feature description.
 *
 * - generateFeatureVideo - Orchestrates the generation of script, storyboard, and voiceover.
 * - GenerateFeatureVideoInput - The input type for the function.
 * - GenerateFeatureVideoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {generateVoiceover} from './generate-voiceover';

const voiceStyleMap: Record<string, string> = {
  'calm-professional': 'Algenib',
  'energetic-promotional': 'Achernar',
  'friendly-casual': 'Algenib', // Use a standard voice, tone is conveyed by script
};

// Input Schema
const GenerateFeatureVideoInputSchema = z.object({
  featureDescription: z
    .string()
    .describe('A text description of the app feature.'),
  videoType: z
    .enum(['Demo', 'Explainer', 'Pitch', 'Promotional'])
    .describe('The type of video to be created.'),
  voiceStyle: z
    .enum(['calm-professional', 'energetic-promotional', 'friendly-casual'])
    .describe('The desired style for the voice-over.'),
});
export type GenerateFeatureVideoInput = z.infer<
  typeof GenerateFeatureVideoInputSchema
>;

// Schemas for the structured output (script and storyboard)
const StoryboardItemSchema = z.object({
  timestamp: z.string().describe('The time range for this scene (e.g., "0:02 - 0:07").'),
  sceneDescription: z.string().describe('A detailed description of the visuals for this scene.'),
  textOverlay: z.string().optional().describe('Any on-screen text to display during this scene.'),
  sfx: z.string().optional().describe('Suggested sound effect for the scene.'),
});

const ScriptAndStoryboardSchema = z.object({
  script: z.string().describe('The complete, narrated script for the video, broken into paragraphs.'),
  storyboard: z.array(StoryboardItemSchema).describe('A shot-by-shot plan for the video.'),
});

// Final Output Schema (includes audio)
const GenerateFeatureVideoOutputSchema = ScriptAndStoryboardSchema.extend({
  audioUrl: z.string().describe('The data URI of the generated voiceover audio file.'),
});
export type GenerateFeatureVideoOutput = z.infer<
  typeof GenerateFeatureVideoOutputSchema
>;

// Main exported function
export async function generateFeatureVideo(
  input: GenerateFeatureVideoInput
): Promise<GenerateFeatureVideoOutput> {
  return generateFeatureVideoFlow(input);
}

// Genkit prompt to generate the script and storyboard
const scriptAndStoryboardPrompt = ai.definePrompt({
  name: 'scriptAndStoryboardPrompt',
  input: {schema: GenerateFeatureVideoInputSchema},
  output: {schema: ScriptAndStoryboardSchema},
  prompt: `You are an expert video producer and scriptwriter specializing in creating compelling videos for software features.
  
  Your task is to create a complete production plan for a feature video.
  
  **Feature Description:**
  {{{featureDescription}}}
  
  **Video Type:** {{{videoType}}}
  **Voice Style:** {{{voiceStyle}}}
  
  Based on the inputs, generate the following:
  1.  **Script:** Write a clear, engaging, and persuasive script that explains the feature and its benefits. The script should match the requested video type and voice style. Structure it for a narrator to read.
  2.  **Storyboard:** Create a detailed, shot-by-shot storyboard. For each scene, provide a timestamp, a visual description, any text overlays, and suggested sound effects. The storyboard should align perfectly with the script.
  `,
});

// Genkit flow to orchestrate the entire process
const generateFeatureVideoFlow = ai.defineFlow(
  {
    name: 'generateFeatureVideoFlow',
    inputSchema: GenerateFeatureVideoInputSchema,
    outputSchema: GenerateFeatureVideoOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the script and storyboard.
    const {output: scriptAndStoryboard} = await scriptAndStoryboardPrompt(input);
    if (!scriptAndStoryboard) {
      throw new Error('Failed to generate script and storyboard.');
    }

    // Step 2: Generate the voiceover using the generated script.
    const voice = voiceStyleMap[input.voiceStyle] || 'Algenib';
    const voiceoverOutput = await generateVoiceover({
      script: scriptAndStoryboard.script,
      voice,
    });

    if (!voiceoverOutput.audioUrl) {
      throw new Error('Failed to generate voiceover.');
    }

    // Step 3: Combine all assets into the final output.
    return {
      ...scriptAndStoryboard,
      audioUrl: voiceoverOutput.audioUrl,
    };
  }
);
