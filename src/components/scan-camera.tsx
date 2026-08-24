import { ScanFlowHeader } from "@/components/scan-flow-header";

export type PositioningState = 1 | 2 | 3;

const FEEDBACK: Record<PositioningState, string> = {
  1: "Dokument vollständig ins Bild bringen",
  2: "Smartphone gerade über das Dokument halten",
  3: "Gut positioniert",
};

function DocumentLines({ large = false }: { large?: boolean }) {
  const lineCount = large ? 14 : 5;

  return (
    <div className="space-y-1.5 pt-1">
      {Array.from({ length: lineCount }, (_, i) => (
        <div
          key={i}
          className={`h-1 bg-foreground/20 ${i % 3 === 1 ? "w-4/5" : i % 3 === 2 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

function PaperDocument({ state }: { state: PositioningState }) {
  const paperClassSmall =
    "h-44 w-32 border border-foreground/40 bg-background p-2";
  const paperClassLarge =
    "h-[400px] w-[270px] border border-foreground/40 bg-background p-3";

  if (state === 1) {
    return (
      <div className="absolute -bottom-10 -right-8 rotate-[-4deg]">
        <div className={paperClassSmall}>
          <DocumentLines />
        </div>
      </div>
    );
  }

  if (state === 2) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[18deg]">
        <div className={paperClassSmall}>
          <DocumentLines />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className={paperClassLarge}>
        <DocumentLines large />
      </div>
    </div>
  );
}

function DetectionFrame({ state }: { state: PositioningState }) {
  if (state === 1) {
    return (
      <div className="pointer-events-none absolute inset-8">
        <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-background" />
        <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-background" />
        <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-background" />
      </div>
    );
  }

  if (state === 2) {
    return (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[18deg]">
        <div className="h-full w-full border border-background/80" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[270px] -translate-x-1/2 -translate-y-1/2">
      <div className="absolute left-0 top-0 h-10 w-10 border-l-[3px] border-t-[3px] border-background" />
      <div className="absolute right-0 top-0 h-10 w-10 border-r-[3px] border-t-[3px] border-background" />
      <div className="absolute bottom-0 left-0 h-10 w-10 border-b-[3px] border-l-[3px] border-background" />
      <div className="absolute bottom-0 right-0 h-10 w-10 border-b-[3px] border-r-[3px] border-background" />
    </div>
  );
}

export function ScanCamera({
  onClose,
  onCapture,
  positioningState,
}: {
  onClose: () => void;
  onCapture: () => void;
  positioningState: PositioningState;
}) {
  return (
    <div className="relative flex h-full flex-col bg-foreground text-background">
      <ScanFlowHeader onClose={onClose} variant="dark" />

      {/* Camera viewport */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Feedback banner */}
        <div className="absolute left-4 right-4 top-3 z-20">
          <p className="rounded-md bg-background px-4 py-2.5 text-center text-sm font-bold text-foreground">
            {FEEDBACK[positioningState]}
          </p>
        </div>

        {/* Document + detection frame */}
        <div className="absolute inset-0">
          <PaperDocument state={positioningState} />
          <DetectionFrame state={positioningState} />
        </div>
      </div>

      {/* Shutter bar */}
      <div className="flex shrink-0 items-center justify-center bg-foreground py-6">
        <button
          type="button"
          onClick={onCapture}
          className="h-16 w-16 rounded-full border-4 border-background bg-transparent"
          aria-label="Aufnahme"
        />
      </div>
    </div>
  );
}
