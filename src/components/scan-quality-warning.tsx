import { Button } from "@/components/ui/button";
import {
  ProcessedPagePreview,
  type ProcessedPagePreviewVariant,
} from "@/components/scan-document-preview";
import { ScanFlowHeader } from "@/components/scan-flow-header";

export type QualityWarningVariant = "truncated" | "tooFar";

const WARNING_COPY: Record<
  QualityWarningVariant,
  { title: string; description: string }
> = {
  truncated: {
    title: "Dokument nicht vollständig erfasst",
    description:
      "„Ein Teil des Dokuments fehlt. Möchten Sie die Seite erneut aufnehmen oder trotzdem verwenden?“",
  },
  tooFar: {
    title: "Dokument zu weit entfernt",
    description:
      "Das Dokument ist zu weit entfernt aufgenommen. Möchten Sie die Seite erneut aufnehmen oder trotzdem verwenden?",
  },
};

export function ScanQualityWarning({
  variant,
  onRetake,
  onUseAnyway,
}: {
  variant: QualityWarningVariant;
  onRetake: () => void;
  onUseAnyway: () => void;
}) {
  const copy = WARNING_COPY[variant];
  const previewVariant: ProcessedPagePreviewVariant =
    variant === "truncated" ? "cutOff" : "tooSmall";

  return (
    <div className="relative flex h-full flex-col bg-muted">
      <ScanFlowHeader variant="light" />

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-2">
        <div className="relative mx-auto flex min-h-0 w-full max-w-[300px] flex-1 flex-col pt-6">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <ProcessedPagePreview variant={previewVariant} />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full max-w-[280px] rounded-lg border bg-background p-4">
          <h2 className="text-base font-bold">{copy.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
          <div className="mt-4 space-y-2">
            <Button className="w-full" onClick={onRetake}>
              Erneut aufnehmen
            </Button>
            <Button variant="outline" className="w-full" onClick={onUseAnyway}>
              Trotzdem verwenden
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
