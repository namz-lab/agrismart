'use server';
/**
 * @fileOverview AI agent that provides treatment recommendations for plant diseases.
 *
 * - generateTreatmentRecommendations - A function that generates treatment recommendations for a given plant disease.
 * - GenerateTreatmentRecommendationsInput - The input type for the generateTreatmentRecommendations function.
 * - GenerateTreatmentRecommendationsOutput - The return type for the generateTreatmentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentRecommendationsInputSchema = z.object({
  diseaseName: z.string().describe('The scientific name of the identified plant disease.'),
  cropName: z.string().describe('The common name of the affected crop (e.g., Beans, Cotton, Maize/Corn).'),
});
export type GenerateTreatmentRecommendationsInput = z.infer<typeof GenerateTreatmentRecommendationsInputSchema>;

const GenerateTreatmentRecommendationsOutputSchema = z.object({
  treatmentRecommendations: z.string().describe('Expert recommendations for treating the identified disease, including fungicide recommendations and organic alternatives. Include actionable treatment steps, specific chemical names (if applicable), and prevention tips.'),
});
export type GenerateTreatmentRecommendationsOutput = z.infer<typeof GenerateTreatmentRecommendationsOutputSchema>;

export async function generateTreatmentRecommendations(input: GenerateTreatmentRecommendationsInput): Promise<GenerateTreatmentRecommendationsOutput> {
  return generateTreatmentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTreatmentRecommendationsPrompt',
  input: {schema: GenerateTreatmentRecommendationsInputSchema},
  output: {schema: GenerateTreatmentRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the identified plant disease and crop, provide treatment recommendations, including both fungicide and organic options. Be sure to include actionable treatment steps, specific chemical names (if applicable), and prevention tips.\n\nCrop: {{{cropName}}}\nDisease: {{{diseaseName}}}`,
});

const generateTreatmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateTreatmentRecommendationsFlow',
    inputSchema: GenerateTreatmentRecommendationsInputSchema,
    outputSchema: GenerateTreatmentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
