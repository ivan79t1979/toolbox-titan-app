import {z} from 'zod';

export const FontPairingInputSchema = z.object({
  style: z
    .string()
    .describe(
      'The desired style for the font pairing (e.g., "modern", "elegant", "playful").'
    ),
});
export type FontPairingInput = z.infer<typeof FontPairingInputSchema>;

const FontPairingSuggestionSchema = z.object({
  headlineFont: z
    .string()
    .describe(
      'The name of the suggested headline font from Google Fonts (e.g., "Roboto Slab").'
    ),
  bodyFont: z
    .string()
    .describe(
      'The name of the suggested body font from Google Fonts (e.g., "Roboto").'
    ),
  reason: z
    .string()
    .describe('A brief explanation of why this pairing works well.'),
});

export const FontPairingOutputSchema = z.object({
  pairings: z
    .array(FontPairingSuggestionSchema)
    .describe('An array of suggested font pairings.'),
});
export type FontPairingOutput = z.infer<typeof FontPairingOutputSchema>;
