import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl font-headline text-primary">AgriSmart</span>
        </Link>
      </div>
    </header>
  );
}
