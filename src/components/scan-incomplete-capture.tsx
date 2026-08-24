import {
  DocumentPageContent,
  type DocumentPageId,
} from "@/components/scan-document-content";

export function IncompleteCaptureDocument({
  pageId = "P2",
}: {
  pageId?: DocumentPageId;
}) {
  return (
    <div className="absolute bottom-8 left-12 rotate-[-2deg]">
      <div className="h-[640px] w-[350px] border border-foreground/40 bg-background p-3">
        <DocumentPageContent pageId={pageId} lineCount={14} />
      </div>
    </div>
  );
}

export function IncompleteCapturePreview({
  pageId = "P2",
}: {
  pageId?: DocumentPageId;
}) {
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden border border-foreground/40 bg-background">
      <IncompleteCaptureDocument pageId={pageId} />
    </div>
  );
}
