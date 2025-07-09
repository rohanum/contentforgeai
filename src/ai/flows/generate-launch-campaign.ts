'use server';

/**
 * @fileOverview Generates a multi-asset launch campaign for a new product.
 *
 * - generateLaunchCampaign - A function that handles the campaign generation.
 * - GenerateLaunchCampaignInput - The input type for the function.
 * - GenerateLaunchCampaignOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Input Schema
const GenerateLaunchCampaignInputSchema = z.object({
  productName: z.string().describe('The name of the product being launched.'),
  productDescription: z.string().describe('A detailed description of the product, its features, and benefits.'),
  targetAudience: z.string().describe('A description of the target audience for this product.'),
  launchGoal: z.enum(['sales', 'awareness', 'signups']).describe('The primary goal of the launch campaign.'),
});
export type GenerateLaunchCampaignInput = z.infer<typeof GenerateLaunchCampaignInputSchema>;

// Output Schema
const EmailCopySchema = z.object({
  subject: z.string().describe('A compelling subject line for the launch announcement email.'),
  body: z.string().describe('The full body copy for the launch email, including a clear call-to-action.'),
});

const SocialPostSchema = z.object({
    platform: z.enum(['X', 'Instagram', 'LinkedIn']).describe('The social media platform for the post.'),
    content: z.string().describe('The full text content for the social media post, including relevant hashtags.'),
});

const LandingPageCopySchema = z.object({
    headline: z.string().describe('A powerful, attention-grabbing headline for the landing page.'),
    subheadline: z.string().describe('A subheadline that elaborates on the value proposition.'),
    features: z.array(z.object({
        name: z.string().describe('The name of the feature.'),
        description: z.string().describe('A brief, benefit-oriented description of the feature.'),
    })).describe('A list of 3-5 key features and their benefits.'),
    cta: z.string().describe('A clear and compelling call-to-action button text.'),
});

const GenerateLaunchCampaignOutputSchema = z.object({
  campaignName: z.string().describe('A creative name for the overall launch campaign strategy.'),
  emailCopy: EmailCopySchema.describe('The copy for the launch announcement email.'),
  socialPosts: z.array(SocialPostSchema).describe('A series of social media posts for different platforms.'),
  videoScript: z.string().describe('A 30-60 second promotional video script for the launch.'),
  landingPageCopy: LandingPageCopySchema.describe('The essential copy elements for a product landing page.'),
});
export type GenerateLaunchCampaignOutput = z.infer<typeof GenerateLaunchCampaignOutputSchema>;


// Main exported function
export async function generateLaunchCampaign(
  input: GenerateLaunchCampaignInput
): Promise<GenerateLaunchCampaignOutput> {
  return generateLaunchCampaignFlow(input);
}


// Genkit prompt
const prompt = ai.definePrompt({
  name: 'generateLaunchCampaignPrompt',
  input: {schema: GenerateLaunchCampaignInputSchema},
  output: {schema: GenerateLaunchCampaignOutputSchema},
  prompt: `You are a world-class marketing director and copywriter specializing in highly successful product launches.
  
  A client has provided the following details for their new product launch. Your task is to generate a complete, multi-channel launch campaign kit.

  **Product Details:**
  - Name: {{{productName}}}
  - Description: {{{productDescription}}}
  - Target Audience: {{{targetAudience}}}
  - Campaign Goal: {{{launchGoal}}}

  Based on these inputs, generate the following assets:
  1.  **Campaign Name:** A creative and memorable name for this launch campaign.
  2.  **Launch Email:** A persuasive announcement email with a strong subject line and clear call-to-action.
  3.  **Social Media Posts:** A set of engaging posts tailored for X (formerly Twitter), Instagram, and LinkedIn.
  4.  **Promo Video Script:** A concise and exciting 30-60 second script for a promotional video.
  5.  **Landing Page Copy:** The core copy elements for a high-converting landing page, including headline, subheadline, key features/benefits, and a CTA.
  `,
});

// Genkit flow
const generateLaunchCampaignFlow = ai.defineFlow(
  {
    name: 'generateLaunchCampaignFlow',
    inputSchema: GenerateLaunchCampaignInputSchema,
    outputSchema: GenerateLaunchCampaignOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate launch campaign.');
    }
    return output;
  }
);
