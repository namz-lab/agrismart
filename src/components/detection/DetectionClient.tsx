'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { identifyPlantDisease } from '@/ai/flows/identify-plant-disease';
import { addToHistory } from '@/lib/history';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { CameraView } from './CameraView';

export function DetectionClient() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleImage = async (imageDataUrl: string) => {
    setIsProcessing(true);
    try {
      const identificationResult = await identifyPlantDisease({ photoDataUri: imageDataUrl });

      if (identificationResult.plantType === 'Unknown' || identificationResult.diseaseName === 'Disease not supported') {
        toast({
            variant: "default",
            title: "Could not identify disease",
            description: "The disease is not supported in the current model. Please try another image.",
        });
        setIsProcessing(false);
        return;
      }

      if (identificationResult.diseaseName === 'Healthy') {
        toast({
            variant: "default",
            title: "Healthy Plant!",
            description: "No disease was detected in the provided image.",
        });
        setIsProcessing(false);
        return;
      }

      const resultId = Date.now().toString();
      const detectionResult = {
        id: resultId,
        timestamp: Date.now(),
        imageDataUrl,
        identification: identificationResult,
      };

      addToHistory(detectionResult);
      router.push(`/analysis/${resultId}`);

    } catch (error) {
      console.error('An error occurred during detection:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        if (imageDataUrl) {
          handleImage(imageDataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader text="Analyzing plant..." />
        <p className="mt-4 text-muted-foreground">This may take a moment.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="camera" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/>Camera</TabsTrigger>
        <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="camera">
        <Card>
          <CardHeader>
            <CardTitle>Live Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraView onCapture={handleImage} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload from Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
             <Upload className="h-16 w-16 text-muted-foreground" />
             <p className="text-center text-muted-foreground">Select an image of a plant leaf from your gallery.</p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <label htmlFor="file-upload">
                    Choose Image
                    <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileUpload} />
                </label>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
