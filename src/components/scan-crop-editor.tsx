import { Check, X } from "lucide-react";
import {
  TooFarCaptureDimOverlay,
  TooFarCapturePreview,
  TooFarDocumentFrame,
} from "@/components/scan-too-far-capture";

function CropBoundary() {
  return (
    <TooFarDocumentFrame className="pointer-events-none border-2 border-background">
      <span className="absolute -left-2.5 -top-2.5 h-5 w-5 border-2 border-background bg-background" />
      <span className="absolute -right-2.5 -top-2.5 h-5 w-5 border-2 border-background bg-background" />
      <span className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-2 border-background bg-background" />
      <span className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-2 border-background bg-background" />
    </TooFarDocumentFrame>
  );
}

export function ScanCropEditor({
  onCancel,
  onApply,
}: {
  onCancel: () => void;
  onApply: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col bg-foreground text-background">
      <div className="relative shrink-0 px-3 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-80"
          aria-label="Zuschneiden abbrechen"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-center text-sm font-bold">Zuschneiden</h1>
        <button
          type="button"
          onClick={onApply}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
          aria-label="Zuschneiden anwenden"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mx-4 mb-4 min-h-0 flex-1">
        <div className="relative h-full min-h-[420px] overflow-hidden">
          <TooFarCapturePreview />
          <TooFarCaptureDimOverlay />
          <CropBoundary />
        </div>
      </div>

      <p className="shrink-0 px-4 pb-6 text-center text-sm">
        Verschieben Sie die Ecken, um den Ausschnitt anzupassen.
      </p>
    </div>
  );
}
