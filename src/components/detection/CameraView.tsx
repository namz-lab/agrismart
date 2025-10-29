'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Zap, ZapOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
}

export function CameraView({ onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Check for flash capability
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
          setHasFlash(true);
        }

      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                setError('Camera permission denied. Please allow camera access in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found. Please ensure a camera is connected and available.');
            }
            else {
                setError('Could not start camera. Please try again.');
            }
        }
      }
    } else {
      setError('Your browser does not support camera access.');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [startCamera]);

  const { toast } = useToast();

  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isFlashOn }],
        });
        setIsFlashOn(!isFlashOn);
      } catch (err) {
        console.error('Failed to toggle flash', err);
        toast({ variant: 'destructive', title: "Could not toggle flash." });
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      onCapture(imageDataUrl);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4 text-center bg-destructive/10 rounded-lg">
        <Camera className="h-12 w-12 text-destructive" />
        <p className="font-semibold text-destructive">{error}</p>
        <Button onClick={startCamera} variant="destructive">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-4 left-4 right-4 flex justify-center items-center gap-4">
        {hasFlash && (
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleFlash}
            className="rounded-full h-12 w-12"
            aria-label="Toggle Flash"
          >
            {isFlashOn ? <ZapOff /> : <Zap />}
          </Button>
        )}
        <Button
          size="icon"
          onClick={handleCapture}
          className="rounded-full h-20 w-20 bg-accent text-accent-foreground hover:bg-accent/90"
          aria-label="Capture Image"
        >
          <Camera className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
