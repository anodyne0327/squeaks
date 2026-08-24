import { Skeleton } from "@/components/ui/skeleton";
import { ScanFlowHeader } from "@/components/scan-flow-header";

export function ScanProcessing() {
  return (
    <div className="flex h-full flex-col bg-foreground text-background">
      <ScanFlowHeader variant="dark" />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mb-4 flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full border-background/40 bg-background/10" />
          <Skeleton className="h-1 w-12 bg-background/20" />
        </div>
        <p className="text-sm">Aufnahme wird verarbeitet …</p>
      </div>
    </div>
  );
}
