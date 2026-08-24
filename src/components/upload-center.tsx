import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  ChevronLeft,
  FileStack,
  Lightbulb,
  Plus,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanCamera, type PositioningState } from "@/components/scan-camera";
import { ScanProcessing } from "@/components/scan-processing";
import { ScanReview } from "@/components/scan-review";
import {
  uploadCenterSections,
  uploadStatusText,
} from "@/data/upload-center-documents";

const INTRO_TITLE = "Dokumente hinzufügen";
const INTRO_TEXT =
  "Scannen oder laden Sie hier Dokumente mit Ihrem Smartphone hoch. Sie werden automatisch Ihrem Antrag hinzugefügt.";

type MobileView =
  | "overview"
  | "scan-intro"
  | "camera"
  | "processing"
  | "review";

const PROCESSING_AUTO_ADVANCE_MS = 1250;
const LAST_SCAN_FLOW_STEP = 5;

function getScanFlowStep(
  view: MobileView,
  positioningState: PositioningState,
  scanPage: number,
): number | null {
  if (view === "camera") {
    if (scanPage === 2) return 5;
    return positioningState - 1;
  }
  if (view === "processing") return 3;
  if (view === "review") return 4;
  return null;
}

const SCAN_TIPS = [
  {
    icon: FileStack,
    title: "Dokument vollständig erfassen",
    text: "Alle Ecken und Ränder sollten sichtbar sein.",
  },
  {
    icon: Smartphone,
    title: "Smartphone gerade über das Dokument halten",
    text: "Vermeiden Sie schräge Aufnahmen.",
  },
  {
    icon: Lightbulb,
    title: "Für gute Beleuchtung sorgen",
    text: "Vermeiden Sie Schatten und Spiegelungen.",
  },
];

function UploadCenterHeader({ largeTitle = false }: { largeTitle?: boolean }) {
  return (
    <div className="border-b bg-background px-4 py-2.5">
      <p className={`font-bold ${largeTitle ? "text-lg" : "text-sm"}`}>
        {INTRO_TITLE}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
        {INTRO_TEXT}
      </p>
    </div>
  );
}

function ScanIntroduction({
  onBack,
  onStartScan,
}: {
  onBack: () => void;
  onStartScan: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center text-muted-foreground hover:text-foreground"
          aria-label="Zurück zum Upload Center"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-lg font-bold">Dokument richtig scannen</h1>
            <p className="text-sm text-muted-foreground">
              So erhalten Sie ein gut lesbares Dokument:
            </p>
          </div>

          <div className="space-y-4">
            {SCAN_TIPS.map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <tip.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border p-4">
            <p className="text-sm font-bold">Mehrseitiges Dokument?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Scannen Sie jede Seite einzeln. Weitere Seiten können Sie
              anschließend hinzufügen.
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t px-4 py-4">
        <Button className="w-full" onClick={onStartScan}>
          Scannen starten
        </Button>
        <button
          type="button"
          className="w-full cursor-pointer py-1 text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Nicht mehr anzeigen
        </button>
      </div>
    </div>
  );
}

function SourceSelectionSheet({
  open,
  onClose,
  onScan,
}: {
  open: boolean;
  onClose: () => void;
  onScan: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Schließen"
        onClick={onClose}
      />
      <div className="relative rounded-t-lg border-t bg-background px-4 pb-6 pt-3">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Dokument hinzufügen</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <Button className="w-full" onClick={onScan}>
            <Camera className="h-4 w-4" />
            Dokument scannen
          </Button>
          <Button variant="outline" className="w-full">
            Datei auswählen
          </Button>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({
  id,
  label,
  uploadedCount,
  selected,
  onAdd,
}: {
  id: string;
  label: string;
  uploadedCount: number;
  selected: boolean;
  onAdd: () => void;
}) {
  const hasUploads = uploadedCount > 0;

  return (
    <div
      id={id}
      className={`scroll-mt-4 rounded-md px-3 py-3 ${selected ? "bg-muted" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start gap-2">
            {hasUploads && (
              <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            )}
            {!hasUploads && <span className="w-4 shrink-0" aria-hidden />}
            <span className="text-sm font-bold leading-snug">{label}</span>
          </div>
          <p className="pl-6 text-xs text-muted-foreground">
            {uploadStatusText(uploadedCount)}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-xs"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5" />
          Hinzufügen
        </Button>
      </div>
    </div>
  );
}

export function UploadCenter({
  highlightDocId,
  onScanPrototypeControls,
}: {
  highlightDocId?: string;
  onScanPrototypeControls?: (
    controls: {
      advance: () => void;
      retreat: () => void;
      canAdvance: boolean;
      canRetreat: boolean;
    } | null,
  ) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);
  const processingAutoAdvance = useRef(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    highlightDocId ?? null,
  );
  const [showStickyHeader, setShowStickyHeader] = useState(!!highlightDocId);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const [view, setView] = useState<MobileView>("overview");
  const [hasSeenScanIntroThisSession, setHasSeenScanIntroThisSession] =
    useState(false);
  const [positioningState, setPositioningState] = useState<PositioningState>(1);
  const [scanPage, setScanPage] = useState(1);

  const updateStickyHeader = () => {
    const scrollEl = scrollRef.current;
    const introEl = introRef.current;
    if (!scrollEl || !introEl) return;
    setShowStickyHeader(scrollEl.scrollTop > introEl.offsetHeight - 8);
  };

  const handleAdd = (docId: string) => {
    setSelectedId(docId);
    setSourceSheetOpen(true);
  };

  const handleStartScan = () => {
    setHasSeenScanIntroThisSession(true);
    setScanPage(1);
    setPositioningState(1);
    setView("camera");
  };

  const goToScanFlow = () => {
    savedScrollTop.current = scrollRef.current?.scrollTop ?? 0;
    setSourceSheetOpen(false);
    setScanPage(1);
    setPositioningState(1);
    if (hasSeenScanIntroThisSession) {
      setView("camera");
    } else {
      setView("scan-intro");
    }
  };

  const goToScanFlowStep = useCallback((step: number) => {
    if (step <= 2) {
      setScanPage(1);
      setView("camera");
      setPositioningState((step + 1) as PositioningState);
      return;
    }

    if (step === 3) {
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 4) {
      setView("review");
      return;
    }

    setScanPage(2);
    setPositioningState(3);
    setView("camera");
  }, []);

  const retreatScanFlow = useCallback(() => {
    const step = getScanFlowStep(view, positioningState, scanPage);
    if (step === null || step <= 0) return;
    goToScanFlowStep(step - 1);
  }, [view, positioningState, scanPage, goToScanFlowStep]);

  const advanceScanFlow = useCallback(() => {
    const step = getScanFlowStep(view, positioningState, scanPage);
    if (step === null || step >= LAST_SCAN_FLOW_STEP) return;
    goToScanFlowStep(step + 1);
  }, [view, positioningState, scanPage, goToScanFlowStep]);

  const handleCapture = () => {
    processingAutoAdvance.current = scanPage === 1;
    setView("processing");
  };

  const handleAddPage = () => {
    setScanPage(2);
    setPositioningState(3);
    setView("camera");
  };

  const handleAbortScanSession = () => {
    setScanPage(1);
    setPositioningState(1);
    setView("overview");
  };

  const handleBackFromScanIntro = () => {
    setView("overview");
  };

  const handleBackFromCamera = () => {
    if (hasSeenScanIntroThisSession) {
      setView("scan-intro");
    } else {
      setView("overview");
    }
  };

  const scanFlowStep = getScanFlowStep(view, positioningState, scanPage);

  useEffect(() => {
    if (scanFlowStep === null) {
      onScanPrototypeControls?.(null);
      return;
    }

    onScanPrototypeControls?.({
      canRetreat: scanFlowStep > 0,
      canAdvance: scanFlowStep < LAST_SCAN_FLOW_STEP,
      retreat: retreatScanFlow,
      advance: advanceScanFlow,
    });
  }, [
    scanFlowStep,
    onScanPrototypeControls,
    retreatScanFlow,
    advanceScanFlow,
  ]);

  useEffect(() => {
    if (view !== "processing" || !processingAutoAdvance.current) return;

    const timer = window.setTimeout(() => {
      setView("review");
      processingAutoAdvance.current = false;
    }, PROCESSING_AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    if (view !== "overview" || !scrollRef.current) return;
    scrollRef.current.scrollTop = savedScrollTop.current;
  }, [view]);

  useEffect(() => {
    if (!highlightDocId) return;

    setSelectedId(highlightDocId);

    const target = document.getElementById(highlightDocId);
    if (target) {
      target.scrollIntoView({ block: "start" });
    }
    setShowStickyHeader(true);
  }, [highlightDocId]);

  if (view === "scan-intro") {
    return (
      <ScanIntroduction
        onBack={handleBackFromScanIntro}
        onStartScan={handleStartScan}
      />
    );
  }

  if (view === "camera") {
    return (
      <ScanCamera
        onClose={handleBackFromCamera}
        onCapture={handleCapture}
        positioningState={positioningState}
      />
    );
  }

  if (view === "processing") {
    return <ScanProcessing />;
  }

  if (view === "review") {
    return (
      <ScanReview
        pageNumber={1}
        onAddPage={handleAddPage}
        onAbortScan={handleAbortScanSession}
      />
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {showStickyHeader && <UploadCenterHeader />}

      <div
        ref={scrollRef}
        onScroll={updateStickyHeader}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <div ref={introRef} className={showStickyHeader ? "sr-only" : undefined}>
          <UploadCenterHeader largeTitle />
        </div>

        <div className="space-y-6 px-2 pb-8 pt-2">
          {uploadCenterSections.map((section) => (
            <section key={section.title}>
              <h2 className="px-2 pb-2 text-sm font-bold">{section.title}</h2>
              <div className="divide-y rounded-md border">
                {section.documents.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    id={doc.id}
                    label={doc.label}
                    uploadedCount={doc.uploadedCount}
                    selected={selectedId === doc.id}
                    onAdd={() => handleAdd(doc.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <SourceSelectionSheet
        open={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        onScan={goToScanFlow}
      />
    </div>
  );
}
