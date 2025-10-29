import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { placeholderImages } from '@/lib/placeholder-images.json';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-plant');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">AgriSmart</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-primary tracking-tight">
                Healthy Crops,
                <br />
                Smarter Farming.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                Instantly identify plant diseases with a snap of your camera. Get expert treatment recommendations and keep your crops thriving.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
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

      <footer className="text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} AgriSmart. All rights reserved.
      </footer>
    </div>
  );
}
