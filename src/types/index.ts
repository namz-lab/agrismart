import type { IdentifyPlantDiseaseOutput } from '@/ai/flows/identify-plant-disease';
import type { GenerateTreatmentRecommendationsOutput } from '@/ai/flows/generate-treatment-recommendations';

export type DetectionResult = {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  identification: IdentifyPlantDiseaseOutput;
  recommendations: GenerateTreatmentRecommendationsOutput;
};
