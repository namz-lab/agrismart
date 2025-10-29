import type { IdentifyPlantDiseaseOutput } from '@/ai/flows/identify-plant-disease';

export type DetectionResult = {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  identification: IdentifyPlantDiseaseOutput;
};
