import { Image as ImageIcon } from "lucide-react";
import { ScanFlowHeader } from "@/components/scan-flow-header";
import {
  DocumentPageContent,
  type DocumentPageId,
} from "@/components/scan-document-content";
import { IncompleteCaptureDocument } from "@/components/scan-incomplete-capture";
import {
  TooFarCaptureDocument,
  TooFarDetectionFrame,
} from "@/components/scan-too-far-capture";

export type PositioningState = 1 | 2 | 3;

const FEEDBACK: Record<PositioningState, string> = {
  1: "Dokument vollständig ins Bild bringen",
  2: "Smartphone gerade über das Dokument halten",
  3: "Gut positioniert",
};

function PaperDocument({
  state,
  documentPageId,
  incompleteCapture = false,
  tooFarCapture = false,
}: {
  state: PositioningState;
  documentPageId: DocumentPageId;
  incompleteCapture?: boolean;
  tooFarCapture?: boolean;
}) {
  const paperClassSmall =
    "h-44 w-32 border border-foreground/40 bg-background p-2";
  const paperClassLarge =
    "h-[400px] w-[270px] border border-foreground/40 bg-background p-3";

  if (tooFarCapture) {
    return <TooFarCaptureDocument pageId={documentPageId} />;
  }

  if (incompleteCapture) {
    return <IncompleteCaptureDocument pageId={documentPageId} />;
  }

  if (state === 1) {
    return (
      <div className="absolute -bottom-10 -right-8 rotate-[-4deg]">
        <div className={paperClassSmall}>
          <DocumentPageContent pageId={documentPageId} lineCount={5} />
        </div>
      </div>
    );
  }

  if (state === 2) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[18deg]">
        <div className={paperClassSmall}>
          <DocumentPageContent pageId={documentPageId} lineCount={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className={paperClassLarge}>
        <DocumentPageContent pageId={documentPageId} lineCount={14} />
      </div>
    </div>
  );
}

function DetectionFrame({
  state,
  tooFarCapture = false,
}: {
  state: PositioningState;
  tooFarCapture?: boolean;
}) {
  if (tooFarCapture) {
    return <TooFarDetectionFrame />;
  }

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
  documentPageId,
  incompleteCapture = false,
  tooFarCapture = false,
  duplicateCapture = false,
  showDeviceAffordance = false,
  onDeviceAffordanceClick,
  emptyViewport = false,
}: {
  onClose: () => void;
  onCapture: () => void;
  positioningState: PositioningState;
  documentPageId: DocumentPageId;
  incompleteCapture?: boolean;
  tooFarCapture?: boolean;
  duplicateCapture?: boolean;
  showDeviceAffordance?: boolean;
  onDeviceAffordanceClick?: () => void;
  emptyViewport?: boolean;
}) {
  const feedback = duplicateCapture
    ? "Diese Seite wurde möglicherweise bereits erfasst"
    : tooFarCapture
      ? "Gehen Sie näher an das Dokument heran"
      : FEEDBACK[positioningState];

  return (
    <div className="relative flex h-full flex-col bg-foreground text-background">
      <ScanFlowHeader onClose={onClose} variant="dark" />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {!emptyViewport && (
          <div className="absolute left-4 right-4 top-3 z-20">
            <p className="rounded-md bg-background px-4 py-2.5 text-center text-sm font-bold text-foreground">
              {feedback}
            </p>
          </div>
        )}

        {!emptyViewport && (
          <div className="absolute inset-0 overflow-hidden">
            <PaperDocument
              state={positioningState}
              documentPageId={documentPageId}
              incompleteCapture={incompleteCapture}
              tooFarCapture={tooFarCapture}
            />
            <DetectionFrame
              state={positioningState}
              tooFarCapture={tooFarCapture}
            />
          </div>
        )}
      </div>

      <div className="relative flex shrink-0 items-center justify-center bg-foreground py-6">
        {showDeviceAffordance && (
          <button
            type="button"
            onClick={onDeviceAffordanceClick}
            className="absolute left-8 text-background/70 hover:text-background"
            aria-label="Bild aus Gerät auswählen"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        )}

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
