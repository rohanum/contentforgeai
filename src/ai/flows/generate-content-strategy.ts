'use server';

/**
 * @fileOverview Generates a comprehensive, multi-platform content strategy for a creator.
 *
 * - generateContentStrategy - A function that handles the content strategy generation.
 * - GenerateContentStrategyInput - The input type for the generateContentStrategy function.
 * - GenerateContentStrategyOutput - The return type for the generateContentStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentStrategyInputSchema = z.object({
  topic: z.string().describe('The user\'s primary topic, niche, or industry.'),
  goal: z.enum(['grow-audience', 'launch-product', 'build-authority']).describe('The primary goal for the content strategy.'),
});
export type GenerateContentStrategyInput = z.infer<typeof GenerateContentStrategyInputSchema>;

const AudiencePersonaSchema = z.object({
    name: z.string().describe("A fictional name for the persona."),
    demographics: z.string().describe("Age, gender, location, occupation of the persona."),
    painPoints: z.array(z.string()).describe("The key problems or challenges the persona faces related to the topic."),
    goals: z.array(z.string()).describe("What the persona hopes to achieve or learn related to the topic."),
});

const PlatformStrategySchema = z.object({
    platform: z.enum(['YouTube', 'Instagram', 'TikTok', 'X']),
    contentFormat: z.string().describe("The best content formats for this platform (e.g., 'In-depth tutorials, product reviews')."),
    postingFrequency: z.string().describe("The recommended posting frequency (e.g., '2 videos per week')."),
    strategicAdvice: z.string().describe("Specific strategic advice for succeeding on this platform."),
});

const WeeklyScheduleSchema = z.object({
    day: z.string().describe("Day of the week (e.g., Monday)."),
    platform: z.string().describe("Which platform to post on."),
    idea: z.string().describe("A concrete content idea to post on that day."),
});

const GenerateContentStrategyOutputSchema = z.object({
  audiencePersona: AudiencePersonaSchema.describe("A detailed description of the target audience persona."),
  contentPillars: z.array(z.string()).describe("An array of 3-5 core content themes or pillars."),
  platformStrategies: z.array(PlatformStrategySchema).describe("An array of tailored strategies for different social media platforms."),
  weeklySchedule: z.array(WeeklyScheduleSchema).describe("A sample one-week content posting schedule."),
  specificIdeas: z.array(z.string()).describe("A list of 5-7 concrete, actionable content ideas."),
});
export type GenerateContentStrategyOutput = z.infer<typeof GenerateContentStrategyOutputSchema>;

export async function generateContentStrategy(input: GenerateContentStrategyInput): Promise<GenerateContentStrategyOutput> {
  return generateContentStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentStrategyPrompt',
  input: {schema: GenerateContentStrategyInputSchema},
  output: {schema: GenerateContentStrategyOutputSchema},
  prompt: `You are an expert Content Strategist and Social Media Manager for a top-tier digital agency.
  
  A client has come to you with the following information:
  - Niche/Topic: {{{topic}}}
  - Primary Goal: {{{goal}}}

  Your task is to generate a comprehensive, actionable content strategy to help them achieve their goal. Be specific, insightful, and creative.

  Please provide the following components in your strategy:
  1.  **Audience Persona:** Create a detailed profile of their ideal follower. Give them a name, demographics, and list their specific pain points and goals related to the client's niche.
  2.  **Content Pillars:** Define 3-5 core themes or content categories that all their content should revolve around. These should provide value and align with their expertise.
  3.  **Platform-Specific Strategies:** Provide tailored strategies for YouTube, Instagram, TikTok, and X (formerly Twitter). For each, specify the best content formats, a recommended posting frequency, and unique strategic advice.
  4.  **Sample Weekly Content Schedule:** Create a one-week posting schedule that maps out what to post on which platform and when.
  5.  **Specific Content Ideas:** Generate a list of 5-7 concrete, actionable video or post ideas that they can create immediately, based on your proposed strategy.
  `,
});

const generateContentStrategyFlow = ai.defineFlow(
  {
    name: 'generateContentStrategyFlow',
    inputSchema: GenerateContentStrategyInputSchema,
    outputSchema: GenerateContentStrategyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
