import { IncompleteCapturePreview } from "@/components/scan-incomplete-capture";
import {
  ProcessedDocumentContent,
  type DocumentPageId,
} from "@/components/scan-document-content";
import { TooFarCapturePreview } from "@/components/scan-too-far-capture";

export type ProcessedPagePreviewVariant =
  | "default"
  | "cutOff"
  | "tooSmall";

export function ProcessedPagePreview({
  variant = "default",
  pageId = "P1",
}: {
  variant?: ProcessedPagePreviewVariant;
  pageId?: DocumentPageId;
}) {
  if (variant === "cutOff") {
    return <IncompleteCapturePreview pageId={pageId} />;
  }

  if (variant === "tooSmall") {
    return <TooFarCapturePreview pageId={pageId} />;
  }

  return (
    <div className="h-full max-h-[520px] w-full border border-foreground/40 bg-background p-4">
      <ProcessedDocumentContent pageId={pageId} />
    </div>
  );
}
