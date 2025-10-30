import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images.json';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-plant');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-headline text-primary">AGRISMART</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-primary tracking-tight">
                AI-Powered Disease Detection for Cash Crops.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                Instantly identify plant diseases with a snap of your camera. Our Vision Transformer model provides accurate diagnosis to protect your harvest.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button asChild size="lg">
                  <Link href="/detect">
                    Start Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96 w-full max-w-md mx-auto">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
