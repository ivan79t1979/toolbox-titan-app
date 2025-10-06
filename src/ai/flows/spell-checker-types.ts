import {z} from 'zod';

export const SpellCheckInputSchema = z.object({
  text: z.string().describe('The text to be checked for spelling and grammar.'),
});
export type SpellCheckInput = z.infer<typeof SpellCheckInputSchema>;

export const SpellCheckOutputSchema = z.object({
  correctedText: z.string().describe('The full text with corrections applied.'),
  suggestions: z
    .array(
      z.object({
        original: z.string().describe('The original incorrect word or phrase.'),
        suggestion: z.string().describe('The suggested correction.'),
        explanation: z
          .string()
          .describe(
            'A brief explanation of why the correction was made.'
          ),
      })
    )
    .describe('A list of suggestions for corrections.'),
});
export type SpellCheckOutput = z.infer<typeof SpellCheckOutputSchema>;
