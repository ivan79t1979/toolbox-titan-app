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
