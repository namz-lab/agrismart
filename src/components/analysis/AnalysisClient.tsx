'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getHistoryItem } from '@/lib/history';
import type { DetectionResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Loader } from '../ui/loader';

interface AnalysisClientProps {
  id: string;
}

export function AnalysisClient({ id }: AnalysisClientProps) {
  const [result, setResult] = useState<DetectionResult | null | undefined>(undefined);

  useEffect(() => {
    setResult(getHistoryItem(id));
  }, [id]);

  if (result === undefined) {
    return <div className="flex h-96 items-center justify-center"><Loader text="Loading analysis..." /></div>;
  }

  if (result === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center h-96">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Analysis Not Found</h2>
        <p className="text-muted-foreground">The requested analysis could not be found in your history.</p>
        <Button asChild>
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go to History
          </Link>
        </Button>
      </div>
    );
  }

  const { identification, imageDataUrl, timestamp } = result;
  const confidencePercent = Math.round(identification.confidenceScore * 100);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
        <Image src={imageDataUrl} alt="Analyzed plant leaf" layout="fill" objectFit="contain" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{identification.diseaseName}</CardTitle>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span>
              <strong>Scientific Name:</strong> <em>{identification.scientificName}</em>
            </span>
            <span>
              <strong>Plant Type:</strong> {identification.plantType}
            </span>
            <span>
                <strong>Date:</strong> {new Date(timestamp).toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">Confidence Score</p>
            <div className="flex items-center gap-4">
              <Progress value={confidencePercent} className="w-full" />
              <span className="font-bold text-lg text-primary">{confidencePercent}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
