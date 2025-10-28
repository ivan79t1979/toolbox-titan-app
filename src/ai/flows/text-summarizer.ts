'use server';
/**
 * @fileOverview An AI-powered text summarizer.
 *
 * - textSummarizer - A function that condenses long text into a summary.
 */

import { ai } from '@/ai/genkit';
import {
  TextSummarizerInputSchema,
  TextSummarizerOutputSchema,
  type TextSummarizerInput,
  type TextSummarizerOutput,
} from './text-summarizer-types';

export async function textSummarizer(
  input: TextSummarizerInput
): Promise<TextSummarizerOutput> {
  return ai.run('textSummarizerFlow', () => textSummarizerFlow(input));
}

const prompt = ai.definePrompt({
  name: 'textSummarizerPrompt',
  input: { schema: TextSummarizerInputSchema },
  output: { schema: TextSummarizerOutputSchema },
  prompt: `You are an expert at summarizing text. Your goal is to provide a concise and accurate summary of the provided content, tailored to the requested length.

- For a 'short' summary, provide a single, powerful sentence or two at most.
- For a 'medium' summary, provide a solid paragraph that captures the main points.
- For a 'long' summary, provide a more detailed summary with multiple paragraphs, covering key arguments and nuances.

Length to generate: {{{length}}}

Text to summarize:
"{{{text}}}"`,
});

const textSummarizerFlow = ai.defineFlow(
  {
    name: 'textSummarizerFlow',
    inputSchema: TextSummarizerInputSchema,
    outputSchema: TextSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
