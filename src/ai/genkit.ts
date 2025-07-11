// src/ai/genkit.ts
import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// This is the global definition of the ai object.
// It will be configured dynamically for each request.
export const ai = genkit({
  plugins: [], // Plugins are now configured dynamically
  model: 'googleai/gemini-2.0-flash',
  // Remove static loglevel to avoid issues in different environments
});

// This function will be called from our server actions
// to configure Genkit with the user's API key for a single request.
export function configureUserGenkit(apiKey: string) {
  configureGenkit({
    plugins: [
      googleAI({
        apiKey: apiKey,
      }),
    ],
    model: 'googleai/gemini-2.0-flash',
    flowStateStore: 'firebase',
    traceStore: 'firebase',
  });
}
