import { IncompleteCapturePreview } from "@/components/scan-incomplete-capture";
import {
  ProcessedDocumentContent,
  type DocumentPageId,
} from "@/components/scan-document-content";
import { TooFarCapturePreview } from "@/components/scan-too-far-capture";

export type ProcessedPagePreviewVariant =
  | "default"
  | "cutOff"
  | "tooSmall"
  | "blurry"
  | "distant";

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

  if (variant === "blurry") {
    return (
      <div className="h-full max-h-[520px] w-full border border-foreground/40 bg-background p-4">
        <div className="blur-[3px] opacity-75">
          <ProcessedDocumentContent pageId={pageId} />
        </div>
      </div>
    );
  }

  if (variant === "distant") {
    return (
      <div className="flex h-full max-h-[520px] w-full items-center justify-center border border-foreground/40 bg-muted p-8">
        <div className="h-[78%] w-[58%] border border-foreground/40 bg-background p-3">
          <ProcessedDocumentContent pageId={pageId} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[520px] w-full border border-foreground/40 bg-background p-4">
      <ProcessedDocumentContent pageId={pageId} />
    </div>
  );
}
