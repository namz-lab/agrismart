import Link from "next/link";
import { AnalysisClient } from "@/components/analysis/AnalysisClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";

interface AnalysisPageProps {
  params: {
    id: string;
  };
}

export default function AnalysisPage({ params }: AnalysisPageProps) {
  return (
    <>
      <AppHeader />
      <div className="container py-6">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Link>
          </Button>
        </div>
        <AnalysisClient id={params.id} />
      </div>
    </>
  );
}
