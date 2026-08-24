import { IncompleteCapturePreview } from "@/components/scan-incomplete-capture";
import { TooFarCapturePreview } from "@/components/scan-too-far-capture";

function ProcessedPageLines() {
  return (
    <div className="space-y-2 pt-2">
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className={`h-1 bg-foreground/20 ${i % 4 === 1 ? "w-4/5" : i % 4 === 2 ? "w-3/5" : i % 4 === 3 ? "w-11/12" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export type ProcessedPagePreviewVariant =
  | "default"
  | "cutOff"
  | "tooSmall";

export function ProcessedPagePreview({
  variant = "default",
}: {
  variant?: ProcessedPagePreviewVariant;
}) {
  if (variant === "cutOff") {
    return <IncompleteCapturePreview />;
  }

  if (variant === "tooSmall") {
    return <TooFarCapturePreview />;
  }

  return (
    <div className="h-full max-h-[520px] w-full border border-foreground/40 bg-background p-4">
      <ProcessedPageLines />
    </div>
  );
}
