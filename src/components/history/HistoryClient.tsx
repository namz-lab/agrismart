'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getHistory, clearHistory as clearStorage } from '@/lib/history';
import type { DetectionResult } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Search, Leaf } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function HistoryClient() {
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setIsMounted(true);
  }, []);
  
  const filteredHistory = useMemo(() => {
    if (!searchTerm) return history;
    return history.filter(item =>
      item.identification.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.identification.plantType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  const clearHistory = () => {
    clearStorage();
    setHistory([]);
  };

  if (!isMounted) {
    // Render a loading state or skeleton
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                 <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-lg"></div>
                    <CardHeader>
                        <div className="h-6 w-3/4 bg-muted rounded"></div>
                        <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by disease or plant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear History
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your detection history.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/analysis/${item.id}`} className="block">
                <div className="aspect-video relative">
                  <Image
                    src={item.imageDataUrl}
                    alt={`Image of ${item.identification.plantType} with ${item.identification.diseaseName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="truncate">{item.identification.diseaseName}</CardTitle>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground justify-between">
                  <span>{item.identification.plantType}</span>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No History Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'No results match your search.' : 'Start a new detection to see your history here.'}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-6">
                <Link href="/detect">Start New Detection</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
