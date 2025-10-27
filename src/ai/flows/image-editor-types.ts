import {z} from 'genkit';

export const ImageEditorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The original photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z
    .string()
    .describe(
      'A detailed description of the edits to make to the image.'
    ),
});
export type ImageEditorInput = z.infer<typeof ImageEditorInputSchema>;

export const ImageEditorOutputSchema = z.object({
    editedPhotoDataUri: z
        .string()
        .describe(
            "The edited photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
});
export type ImageEditorOutput = z.infer<
  typeof ImageEditorOutputSchema
>;
