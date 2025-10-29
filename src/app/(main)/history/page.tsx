import { HistoryClient } from "@/components/history/HistoryClient";

export default function HistoryPage() {
  return (
    <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6 font-headline">Detection History</h1>
        <HistoryClient />
    </div>
  );
}
