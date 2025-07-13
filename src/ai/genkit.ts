import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { vertexAI } from '@genkit-ai/vertexai';

// This function configures Genkit with the user's API key for a single request
export function configureUserGenkit(apiKey: string) {
  configureGenkit({
    plugins: [
      googleAI({ apiKey }),
      // vertexAI() // Uncomment if using Vertex
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
  });
}

// Export the ai object for type safety
export const ai = {
  defineFlow: (config: any, handler: any) => ({
    __isFlow: true,
    config,
    handler
  }),
  definePrompt: (config: any) => ({
    __isPrompt: true,
    config
  }),
  generate: async (options: any) => {
    // Implementation will be handled by Genkit runtime
    return {} as any;
  }
};

// Type helpers for better developer experience
declare module '@genkit-ai/core' {
  interface FlowDefinition<Input, Output> {
    __isFlow: true;
    config: any;
    handler: (input: Input) => Promise<Output>;
  }
  
  interface PromptDefinition<Input, Output> {
    __isPrompt: true;
    config: any;
  }
}
