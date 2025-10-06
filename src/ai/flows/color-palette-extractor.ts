'use server';
/**
 * @fileOverview An AI-powered tool to extract a color palette from an image.
 *
 * - extractColorPalette - A function that analyzes an image and returns its dominant colors.
 * - ColorPaletteExtractorInput - The input type for the extractColorPalette function.
 * - ColorPaletteExtractorOutput - The return type for the extractColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ColorPaletteExtractorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the image to extract colors from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ColorPaletteExtractorInput = z.infer<
  typeof ColorPaletteExtractorInputSchema
>;

export const ColorPaletteExtractorOutputSchema = z.object({
  colors: z
    .array(
      z.object({
        hex: z
          .string()
          .describe(
            'The hex code of the extracted color (e.g., "#RRGGBB").'
          ),
        name: z.string().describe('A common, descriptive name for the color.'),
      })
    )
    .describe('An array of 5-7 dominant colors extracted from the image.'),
});
export type ColorPaletteExtractorOutput = z.infer<
  typeof ColorPaletteExtractorOutputSchema
>;

export async function extractColorPalette(
  input: ColorPaletteExtractorInput
): Promise<ColorPaletteExtractorOutput> {
  return colorPaletteExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'colorPaletteExtractorPrompt',
  input: {schema: ColorPaletteExtractorInputSchema},
  output: {schema: ColorPaletteExtractorOutputSchema},
  prompt: `You are a color expert. Analyze the provided image and extract a palette of the 5-7 most dominant and representative colors.

For each color, provide its HEX code and a simple, common name for that color (e.g., "Deep Sky Blue", "Forest Green", "Warm Sand").

Image: {{media url=photoDataUri}}`,
});

const colorPaletteExtractorFlow = ai.defineFlow(
  {
    name: 'colorPaletteExtractorFlow',
    inputSchema: ColorPaletteExtractorInputSchema,
    outputSchema: ColorPaletteExtractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
