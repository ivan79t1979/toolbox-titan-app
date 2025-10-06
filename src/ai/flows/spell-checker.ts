'use server';
/**
 * @fileOverview An AI-powered spell and grammar checker.
 *
 * - spellCheck - A function that checks text for errors and provides suggestions.
 * - SpellCheckInput - The input type for the spellCheck function.
 * - SpellCheckOutput - The return type for the spellCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SpellCheckInputSchema = z.object({
  text: z.string().describe('The text to be checked for spelling and grammar.'),
});
export type SpellCheckInput = z.infer<typeof SpellCheckInputSchema>;

export const SpellCheckOutputSchema = z.object({
  correctedText: z.string().describe('The full text with corrections applied.'),
  suggestions: z.array(
    z.object({
      original: z.string().describe('The original incorrect word or phrase.'),
      suggestion: z.string().describe('The suggested correction.'),
      explanation: z.string().describe('A brief explanation of why the correction was made.'),
    })
  ).describe('A list of suggestions for corrections.'),
});
export type SpellCheckOutput = z.infer<typeof SpellCheckOutputSchema>;

export async function spellCheck(
  input: SpellCheckInput
): Promise<SpellCheckOutput> {
  return spellCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spellCheckPrompt',
  input: {schema: SpellCheckInputSchema},
  output: {schema: SpellCheckOutputSchema},
  prompt: `You are an expert spell checker and grammar editor. Analyze the following text for any spelling mistakes, grammatical errors, or awkward phrasing.

Provide a corrected version of the full text.

Also, provide a list of suggestions detailing each change. For each suggestion, include the original word or phrase, the suggested correction, and a brief explanation for the change (e.g., "Spelling mistake", "Grammar: Subject-verb agreement", "Better word choice").

Text to check:
"{{{text}}}"`,
});

const spellCheckFlow = ai.defineFlow(
  {
    name: 'spellCheckFlow',
    inputSchema: SpellCheckInputSchema,
    outputSchema: SpellCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
