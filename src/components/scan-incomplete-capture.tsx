function IncompleteCaptureLines() {
  return (
    <div className="space-y-1.5 pt-1">
      {Array.from({ length: 14 }, (_, i) => (
        <div
          key={i}
          className={`h-1 bg-foreground/20 ${i % 3 === 1 ? "w-4/5" : i % 3 === 2 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

const INCOMPLETE_CAPTURE_POSITION =
  "absolute bottom-8 left-12 rotate-[-2deg]";

const INCOMPLETE_CAPTURE_PAPER =
  "h-[640px] w-[350px] border border-foreground/40 bg-background p-3";

export function IncompleteCaptureDocument() {
  return (
    <div className={INCOMPLETE_CAPTURE_POSITION}>
      <div className={INCOMPLETE_CAPTURE_PAPER}>
        <IncompleteCaptureLines />
      </div>
    </div>
  );
}

export function IncompleteCapturePreview() {
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden border border-foreground/40 bg-background">
      <IncompleteCaptureDocument />
    </div>
  );
}
