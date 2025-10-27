'use server';
/**
 * @fileOverview An AI-powered image editing flow.
 *
 * - editImage - A function that edits an image based on a text prompt.
 */

import {ai} from '@/ai/genkit';
import {
  ImageEditorInputSchema,
  ImageEditorOutputSchema,
  type ImageEditorInput,
  type ImageEditorOutput,
} from './image-editor-types';

export async function editImage(
  input: ImageEditorInput
): Promise<ImageEditorOutput> {
  return imageEditorFlow(input);
}

const imageEditorFlow = ai.defineFlow(
  {
    name: 'imageEditorFlow',
    inputSchema: ImageEditorInputSchema,
    outputSchema: ImageEditorOutputSchema,
  },
  async (input) => {
    try {
        const { operation } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: [
                {media: {url: input.photoDataUri}},
                {text: input.prompt},
            ],
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        const output = await ai.waitForOperation(operation);

        if (output?.message?.content) {
            const imagePart = output.message.content.find(part => part.media);
            if (imagePart && imagePart.media?.url) {
                return { editedPhotoDataUri: imagePart.media.url };
            }
        }
    } catch (error: any) {
        if (error.message && error.message.includes('429 Too Many Requests')) {
            throw new Error('AI rate limit exceeded. Please try again later.');
        }
        // Re-throw other errors
        throw error;
    }


    throw new Error('AI did not return an edited image.');
  }
);
