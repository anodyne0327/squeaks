import {
  DocumentPageContent,
  type DocumentPageId,
} from "@/components/scan-document-content";

const TOO_FAR_DOC_HALF_W = "75px";
const TOO_FAR_DOC_HALF_H = "100px";

export function TooFarDocumentFrame({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 h-[200px] w-[150px] -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {children}
    </div>
  );
}

export function TooFarCaptureDimOverlay() {
  return (
    <>
      <div
        className="absolute left-0 right-0 top-0 bg-black/55"
        style={{ bottom: `calc(50% + ${TOO_FAR_DOC_HALF_H})` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-black/55"
        style={{ top: `calc(50% + ${TOO_FAR_DOC_HALF_H})` }}
      />
      <div
        className="absolute left-0 bg-black/55"
        style={{
          top: `calc(50% - ${TOO_FAR_DOC_HALF_H})`,
          height: "200px",
          width: `calc(50% - ${TOO_FAR_DOC_HALF_W})`,
        }}
      />
      <div
        className="absolute right-0 bg-black/55"
        style={{
          top: `calc(50% - ${TOO_FAR_DOC_HALF_H})`,
          height: "200px",
          width: `calc(50% - ${TOO_FAR_DOC_HALF_W})`,
        }}
      />
    </>
  );
}

export function TooFarCaptureDocument({
  pageId = "P3",
}: {
  pageId?: DocumentPageId;
}) {
  return (
    <TooFarDocumentFrame>
      <div className="h-full w-full border border-foreground/40 bg-background p-2">
        <DocumentPageContent pageId={pageId} lineCount={8} />
      </div>
    </TooFarDocumentFrame>
  );
}

export function TooFarCapturePreview({
  pageId = "P3",
}: {
  pageId?: DocumentPageId;
}) {
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden border border-foreground/40 bg-foreground">
      <TooFarCaptureDocument pageId={pageId} />
    </div>
  );
}

export function TooFarDetectionFrame() {
  return (
    <TooFarDocumentFrame className="pointer-events-none border border-background/80" />
  );
}
