import { Skeleton } from "@/components/ui/skeleton";

export function ScanProcessing() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-foreground px-6 text-background">
      <div className="mb-4 flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full border-background/40 bg-background/10" />
        <Skeleton className="h-1 w-12 bg-background/20" />
      </div>
      <p className="text-sm">Aufnahme wird verarbeitet …</p>
    </div>
  );
}
