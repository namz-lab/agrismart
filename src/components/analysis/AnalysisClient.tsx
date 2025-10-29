'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getHistoryItem } from '@/lib/history';
import type { DetectionResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, AlertTriangle, Leaf, Syringe, ShieldCheck } from 'lucide-react';
import { Loader } from '../ui/loader';

interface AnalysisClientProps {
  id: string;
}

export function AnalysisClient({ id }: AnalysisClientProps) {
  const [result, setResult] = useState<DetectionResult | null | undefined>(undefined);

  useEffect(() => {
    setResult(getHistoryItem(id));
  }, [id]);

  const parsedRecommendations = useMemo(() => {
    if (!result) return {};
    const text = result.recommendations.treatmentRecommendations;
    const sections: { [key: string]: string } = {};
    const regex = /(Fungicide Recommendations|Organic Alternatives|Prevention Tips):/gi;
    let match;
    let lastIndex = 0;
    const keys: string[] = [];

    while ((match = regex.exec(text)) !== null) {
      if (keys.length > 0) {
        sections[keys[keys.length - 1]] = text.substring(lastIndex, match.index).trim();
      }
      keys.push(match[1]);
      lastIndex = match.index + match[0].length;
    }
    if (keys.length > 0) {
      sections[keys[keys.length - 1]] = text.substring(lastIndex).trim();
    }
    
    if (Object.keys(sections).length === 0) {
        return { 'Recommendations': text };
    }

    return sections;
  }, [result]);

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

  const { identification, recommendations, imageDataUrl, timestamp } = result;
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
      
      <Card>
        <CardHeader>
            <CardTitle>Treatment & Prevention</CardTitle>
            <CardDescription>Expert recommendations to manage the disease and protect your crops.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(parsedRecommendations)[0] || 'Recommendations'}>
                {Object.entries(parsedRecommendations).map(([title, content]) => (
                     <AccordionItem value={title} key={title}>
                        <AccordionTrigger className="text-lg font-semibold">
                            <div className="flex items-center gap-2">
                                {title.includes('Fungicide') && <Syringe className="h-5 w-5 text-primary" />}
                                {title.includes('Organic') && <Leaf className="h-5 w-5 text-primary" />}
                                {title.includes('Prevention') && <ShieldCheck className="h-5 w-5 text-primary" />}
                                {title}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap">
                            {content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
