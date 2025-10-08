import {z} from 'zod';

export const DatasetGeneratorInputSchema = z.object({
  description: z
    .string()
    .describe('A natural language description of the dataset to generate.'),
  format: z
    .enum(['json', 'csv'])
    .describe('The desired output format for the data (JSON or CSV).'),
  count: z
    .number()
    .min(1)
    .max(100)
    .describe('The number of data records to generate.'),
});
export type DatasetGeneratorInput = z.infer<
  typeof DatasetGeneratorInputSchema
>;

export const DatasetGeneratorOutputSchema = z.object({
  data: z.string().describe('The generated dataset as a string in the specified format.'),
});
export type DatasetGeneratorOutput = z.infer<
  typeof DatasetGeneratorOutputSchema
>;
