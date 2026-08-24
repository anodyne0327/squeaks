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
import { ScanDeviceFilePicker } from "@/components/scan-device-file-picker";
import { ScanDeviceSourceChooser } from "@/components/scan-device-source-chooser";
import { ScanCropEditor } from "@/components/scan-crop-editor";
import { ScanDocumentReview } from "@/components/scan-document-review";
import { ScanProcessing } from "@/components/scan-processing";
import { ScanQualityWarning } from "@/components/scan-quality-warning";
import { ScanReview } from "@/components/scan-review";
import {
  type DocumentPageId,
  getDocumentPageId,
} from "@/components/scan-document-content";
import type { ProcessedPagePreviewVariant } from "@/components/scan-document-preview";
import {
  uploadCenterSections,
  uploadStatusText,
} from "@/data/upload-center-documents";
import {
  initialPersonalausweisUploadCount,
  isPersonalausweisScanComplete,
  markPersonalausweisScanComplete,
} from "@/data/prototype-scan-sync";

const INTRO_TITLE = "Dokumente hinzufügen";
const INTRO_TEXT =
  "Scannen oder laden Sie hier Dokumente mit Ihrem Smartphone hoch. Sie werden automatisch Ihrem Antrag hinzugefügt.";

type MobileView =
  | "overview"
  | "scan-intro"
  | "device-source"
  | "device-picker"
  | "camera"
  | "processing"
  | "review"
  | "warning"
  | "crop"
  | "document-review";

const PROCESSING_AUTO_ADVANCE_MS = 1250;
const LAST_SCAN_FLOW_STEP = 30;
const LAST_FILE_IMPORT_STEP = 3;
const DEFAULT_DOCUMENT_NAME = "2026_08_24_Personalausweis_oder_Reisepass";
const SCAN_TARGET_DOC_ID = "antragstellung-personalausweis";
const INITIAL_ASSEMBLED_PAGES: DocumentPageId[] = [
  "P1",
  "P2",
  "P3",
  "P3",
  "P4",
];

function getScanFlowStep(
  view: MobileView,
  positioningState: PositioningState,
  scanPage: number,
  page2CameraIncomplete: boolean,
  page2CaptureTruncated: boolean,
  page3CaptureTooSmall: boolean,
  page3Cropped: boolean,
): number | null {
  if (view === "document-review") return 27;
  if (view === "device-source" && scanPage === 5) return 23;
  if (view === "device-picker" && scanPage === 5) return 24;
  if (view === "camera") {
    if (scanPage === 6) return 28;
    if (scanPage === 5) return 22;
    if (scanPage === 4) return 18;
    if (scanPage === 3) return 12;
    if (scanPage === 2) {
      return page2CameraIncomplete ? 5 : 9;
    }
    return positioningState - 1;
  }
  if (view === "processing") {
    if (scanPage === 6) return 29;
    if (scanPage === 5) return 25;
    if (scanPage === 4) return 19;
    if (scanPage === 3) return 13;
    if (scanPage === 2) {
      return page2CameraIncomplete ? 6 : 10;
    }
    return 3;
  }
  if (view === "warning") {
    if (scanPage === 4) return 20;
    if (scanPage === 3) return 14;
    return 7;
  }
  if (view === "crop") return 16;
  if (view === "review") {
    if (scanPage === 6) return 30;
    if (scanPage === 5) return 26;
    if (scanPage === 4) return 21;
    if (scanPage === 3) {
      if (page3Cropped) return 17;
      if (page3CaptureTooSmall) return 15;
      return 15;
    }
    if (scanPage === 2) {
      return page2CaptureTruncated ? 8 : 11;
    }
    return 4;
  }
  return null;
}

function getFileImportFlowStep(
  view: MobileView,
  isFileImportPath: boolean,
): number | null {
  if (!isFileImportPath) return null;
  if (view === "device-source") return 0;
  if (view === "device-picker") return 1;
  if (view === "processing") return 2;
  if (view === "review") return 3;
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
  onSelectFile,
}: {
  open: boolean;
  onClose: () => void;
  onScan: () => void;
  onSelectFile: () => void;
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
          <Button variant="outline" className="w-full" onClick={onSelectFile}>
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
          <p className="min-h-4 pl-6 text-xs leading-4 text-muted-foreground">
            {hasUploads ? uploadStatusText(uploadedCount) : null}
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
  const processingNextView = useRef<"review" | "warning">("review");
  const [selectedId, setSelectedId] = useState<string | null>(
    highlightDocId ?? null,
  );
  const [documentUploadCounts, setDocumentUploadCounts] = useState<
    Record<string, number>
  >(() => {
    const counts: Record<string, number> = {};
    for (const section of uploadCenterSections) {
      for (const doc of section.documents) {
        counts[doc.id] =
          doc.id === SCAN_TARGET_DOC_ID
            ? initialPersonalausweisUploadCount(doc.uploadedCount)
            : doc.uploadedCount;
      }
    }
    return counts;
  });
  const [activeScanDocId, setActiveScanDocId] = useState<string | null>(
    highlightDocId ?? SCAN_TARGET_DOC_ID,
  );
  const [showStickyHeader, setShowStickyHeader] = useState(!!highlightDocId);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const [view, setView] = useState<MobileView>("overview");
  const [hasSeenScanIntroThisSession, setHasSeenScanIntroThisSession] =
    useState(false);
  const [positioningState, setPositioningState] = useState<PositioningState>(1);
  const [scanPage, setScanPage] = useState(1);
  const [page2CameraIncomplete, setPage2CameraIncomplete] = useState(true);
  const [page2CaptureTruncated, setPage2CaptureTruncated] = useState(false);
  const [page3CaptureTooSmall, setPage3CaptureTooSmall] = useState(false);
  const [page3Cropped, setPage3Cropped] = useState(false);
  const [isFileImportPath, setIsFileImportPath] = useState(false);
  const [processingFromDeviceUpload, setProcessingFromDeviceUpload] =
    useState(false);
  const [documentName, setDocumentName] = useState(DEFAULT_DOCUMENT_NAME);
  const [assembledPages, setAssembledPages] = useState<DocumentPageId[]>(
    INITIAL_ASSEMBLED_PAGES,
  );
  const [returnToDocumentReview, setReturnToDocumentReview] = useState(false);

  const updateStickyHeader = () => {
    const scrollEl = scrollRef.current;
    const introEl = introRef.current;
    if (!scrollEl || !introEl) return;
    setShowStickyHeader(scrollEl.scrollTop > introEl.offsetHeight - 8);
  };

  const handleAdd = (docId: string) => {
    setSelectedId(docId);
    setActiveScanDocId(docId);
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
    setIsFileImportPath(false);
    setScanPage(1);
    setPositioningState(1);
    if (hasSeenScanIntroThisSession) {
      setView("camera");
    } else {
      setView("scan-intro");
    }
  };

  const goToFileImportFlow = () => {
    savedScrollTop.current = scrollRef.current?.scrollTop ?? 0;
    setSourceSheetOpen(false);
    setIsFileImportPath(true);
    setScanPage(1);
    setPage2CameraIncomplete(true);
    setPage2CaptureTruncated(false);
    setPage3CaptureTooSmall(false);
    setPage3Cropped(false);
    setPositioningState(1);
    setView("device-source");
  };

  const goToFileImportFlowStep = useCallback((step: number) => {
    setIsFileImportPath(true);
    setScanPage(1);
    setPage2CameraIncomplete(true);
    setPage2CaptureTruncated(false);
    setPage3CaptureTooSmall(false);
    setPage3Cropped(false);

    if (step <= 0) {
      setSourceSheetOpen(false);
      setView("device-source");
      return;
    }

    if (step === 1) {
      setView("device-picker");
      return;
    }

    if (step === 2) {
      setProcessingFromDeviceUpload(true);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    setView("review");
  }, []);

  const goToScanFlowStep = useCallback((step: number) => {
    if (step <= 2) {
      setScanPage(1);
      setView("camera");
      setPositioningState((step + 1) as PositioningState);
      return;
    }

    if (step === 3) {
      setScanPage(1);
      setProcessingFromDeviceUpload(false);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 4) {
      setScanPage(1);
      setView("review");
      return;
    }

    if (step === 5) {
      setScanPage(2);
      setPage2CameraIncomplete(true);
      setPage2CaptureTruncated(false);
      setPositioningState(1);
      setView("camera");
      return;
    }

    if (step === 6) {
      setScanPage(2);
      setPage2CameraIncomplete(true);
      setProcessingFromDeviceUpload(false);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 7) {
      setScanPage(2);
      setPage2CameraIncomplete(true);
      setView("warning");
      return;
    }

    if (step === 8) {
      setScanPage(2);
      setPage2CaptureTruncated(true);
      setView("review");
      return;
    }

    if (step === 9) {
      setScanPage(2);
      setPage2CameraIncomplete(false);
      setPage2CaptureTruncated(false);
      setPositioningState(3);
      setView("camera");
      return;
    }

    if (step === 10) {
      setScanPage(2);
      setPage2CameraIncomplete(false);
      setProcessingFromDeviceUpload(false);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 11) {
      setScanPage(2);
      setPage2CaptureTruncated(false);
      setView("review");
      return;
    }

    if (step === 12) {
      setScanPage(3);
      setPage3CaptureTooSmall(false);
      setPage3Cropped(false);
      setView("camera");
      return;
    }

    if (step === 13) {
      setScanPage(3);
      setProcessingFromDeviceUpload(false);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 14) {
      setScanPage(3);
      setPage3CaptureTooSmall(false);
      setPage3Cropped(false);
      setView("warning");
      return;
    }

    if (step === 15) {
      setScanPage(3);
      setPage3CaptureTooSmall(true);
      setPage3Cropped(false);
      setView("review");
      return;
    }

    if (step === 16) {
      setScanPage(3);
      setPage3CaptureTooSmall(true);
      setPage3Cropped(false);
      setView("crop");
      return;
    }

    if (step === 17) {
      setScanPage(3);
      setPage3CaptureTooSmall(false);
      setPage3Cropped(true);
      setView("review");
      return;
    }

    if (step === 18) {
      setScanPage(4);
      setPositioningState(3);
      setView("camera");
      return;
    }

    if (step === 19) {
      setScanPage(4);
      setProcessingFromDeviceUpload(false);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 20) {
      setScanPage(4);
      setView("warning");
      return;
    }

    if (step === 21) {
      setScanPage(4);
      setView("review");
      return;
    }

    if (step === 22) {
      setScanPage(5);
      setPositioningState(3);
      setView("camera");
      return;
    }

    if (step === 23) {
      setScanPage(5);
      setView("device-source");
      return;
    }

    if (step === 24) {
      setScanPage(5);
      setView("device-picker");
      return;
    }

    if (step === 25) {
      setScanPage(5);
      setProcessingFromDeviceUpload(true);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    if (step === 26) {
      setScanPage(5);
      setView("review");
      return;
    }

    if (step === 27) {
      setAssembledPages(INITIAL_ASSEMBLED_PAGES);
      setView("document-review");
      return;
    }

    if (step === 28) {
      setReturnToDocumentReview(true);
      setPage2CameraIncomplete(true);
      setPage2CaptureTruncated(false);
      setPage3CaptureTooSmall(false);
      setPage3Cropped(false);
      setScanPage(6);
      setPositioningState(3);
      setView("camera");
      return;
    }

    if (step === 29) {
      setReturnToDocumentReview(true);
      setScanPage(6);
      setProcessingFromDeviceUpload(false);
      processingAutoAdvance.current = false;
      setView("processing");
      return;
    }

    setReturnToDocumentReview(true);
    setScanPage(6);
    setView("review");
  }, []);

  const resetScanSessionState = useCallback(() => {
    setScanPage(1);
    setPage2CameraIncomplete(true);
    setPage2CaptureTruncated(false);
    setPage3CaptureTooSmall(false);
    setPage3Cropped(false);
    setPositioningState(1);
    setReturnToDocumentReview(false);
    setAssembledPages(INITIAL_ASSEMBLED_PAGES);
    setDocumentName(DEFAULT_DOCUMENT_NAME);
  }, []);

  const retreatFromFileImportEntry = useCallback(() => {
    setIsFileImportPath(false);
    setSourceSheetOpen(true);
    setView("overview");
  }, []);

  const retreatFileImportFlow = useCallback(() => {
    const step = getFileImportFlowStep(view, isFileImportPath);
    if (step === null) return;

    if (step <= 0) {
      retreatFromFileImportEntry();
      return;
    }

    goToFileImportFlowStep(step - 1);
  }, [view, isFileImportPath, goToFileImportFlowStep, retreatFromFileImportEntry]);

  const advanceFileImportFlow = useCallback(() => {
    const step = getFileImportFlowStep(view, isFileImportPath);
    if (step === null || step >= LAST_FILE_IMPORT_STEP) return;

    if (step === 1) {
      processingAutoAdvance.current = true;
      processingNextView.current = "review";
    }

    goToFileImportFlowStep(step + 1);
  }, [view, isFileImportPath, goToFileImportFlowStep]);

  const handleDeviceSourceSelectFile = () => {
    setView("device-picker");
  };

  const handleSessionDeviceAffordance = () => {
    setScanPage(5);
    setView("device-source");
  };

  const handleFilePickerSelectDocument = () => {
    setProcessingFromDeviceUpload(true);
    processingAutoAdvance.current = true;
    processingNextView.current = "review";
    setView("processing");
  };

  const retreatScanFlow = useCallback(() => {
    const step = getScanFlowStep(
      view,
      positioningState,
      scanPage,
      page2CameraIncomplete,
      page2CaptureTruncated,
      page3CaptureTooSmall,
      page3Cropped,
    );
    if (step === null || step <= 0) return;
    goToScanFlowStep(step - 1);
  }, [
    view,
    positioningState,
    scanPage,
    page2CameraIncomplete,
    page2CaptureTruncated,
    page3CaptureTooSmall,
    page3Cropped,
    goToScanFlowStep,
  ]);

  const advanceScanFlow = useCallback(() => {
    const step = getScanFlowStep(
      view,
      positioningState,
      scanPage,
      page2CameraIncomplete,
      page2CaptureTruncated,
      page3CaptureTooSmall,
      page3Cropped,
    );
    if (step === null || step >= LAST_SCAN_FLOW_STEP) return;

    if (step === 24) {
      processingAutoAdvance.current = true;
      processingNextView.current = "review";
    }

    goToScanFlowStep(step + 1);
  }, [
    view,
    positioningState,
    scanPage,
    page2CameraIncomplete,
    page2CaptureTruncated,
    page3CaptureTooSmall,
    page3Cropped,
    goToScanFlowStep,
  ]);

  const handleCapture = () => {
    setProcessingFromDeviceUpload(false);
    processingAutoAdvance.current = true;
    if (scanPage === 1 || scanPage === 5 || scanPage === 6) {
      processingNextView.current = "review";
    } else if (scanPage === 4) {
      processingNextView.current = "warning";
    } else if (scanPage === 2 && page2CameraIncomplete) {
      processingNextView.current = "warning";
    } else if (scanPage === 2) {
      processingNextView.current = "review";
    } else {
      processingNextView.current = "warning";
    }
    setView("processing");
  };

  const handleAddPage = () => {
    setIsFileImportPath(false);

    if (scanPage === 1) {
      setScanPage(2);
      setPage2CameraIncomplete(true);
      setPage2CaptureTruncated(false);
      setPositioningState(1);
      setView("camera");
      return;
    }

    if (scanPage === 2) {
      setScanPage(3);
      setPage3CaptureTooSmall(false);
      setPage3Cropped(false);
      setView("camera");
      return;
    }

    if (scanPage === 3) {
      setScanPage(4);
      setPositioningState(3);
      setView("camera");
      return;
    }

    setScanPage(5);
    setPositioningState(3);
    setView("camera");
  };

  const handleRetakePage2Camera = () => {
    setPage2CameraIncomplete(false);
    setPositioningState(3);
    setView("camera");
  };

  const handleRetakePage3Camera = () => {
    setPage3CaptureTooSmall(false);
    setPage3Cropped(false);
    setView("camera");
  };

  const handleRetakePage4Camera = () => {
    setPositioningState(3);
    setView("camera");
  };

  const handleWarningUseAnyway = () => {
    if (scanPage === 4) {
      setView("review");
      return;
    }

    if (scanPage === 3) {
      setPage3CaptureTooSmall(true);
      setPage3Cropped(false);
      setView("review");
      return;
    }

    setPage2CaptureTruncated(true);
    setView("review");
  };

  const handleCropCancel = () => {
    setView("review");
  };

  const handleCropApply = () => {
    setPage3Cropped(true);
    setPage3CaptureTooSmall(false);
    setView("review");
  };

  const handleFinishSinglePageReview = () => {
    if (scanPage === 6 && returnToDocumentReview) {
      setAssembledPages((pages) => [...pages, getDocumentPageId(6)]);
      setReturnToDocumentReview(false);
      setView("document-review");
      return;
    }

    if (scanPage === 5) {
      setAssembledPages(INITIAL_ASSEMBLED_PAGES);
      setView("document-review");
    }
  };

  const handleDocumentReviewBack = () => {
    setScanPage(assembledPages.length);
    setView("review");
  };

  const handleDocumentReviewAddPage = () => {
    setReturnToDocumentReview(true);
    setPage2CameraIncomplete(true);
    setPage2CaptureTruncated(false);
    setPage3CaptureTooSmall(false);
    setPage3Cropped(false);
    setScanPage(6);
    setPositioningState(3);
    setView("camera");
  };

  const handleDocumentReviewRestart = () => {
    resetScanSessionState();
    setView("camera");
  };

  const handleDocumentReviewFinish = () => {
    const docId = activeScanDocId ?? SCAN_TARGET_DOC_ID;

    if (docId === SCAN_TARGET_DOC_ID) {
      if (!isPersonalausweisScanComplete()) {
        markPersonalausweisScanComplete();
        setDocumentUploadCounts((counts) => ({
          ...counts,
          [docId]: (counts[docId] ?? 0) + 1,
        }));
      }
    } else {
      setDocumentUploadCounts((counts) => ({
        ...counts,
        [docId]: (counts[docId] ?? 0) + 1,
      }));
    }

    setSelectedId(docId);
    setView("overview");
  };

  const handleAbortScanSession = () => {
    setIsFileImportPath(false);
    resetScanSessionState();
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

  const scanFlowStep = getScanFlowStep(
    view,
    positioningState,
    scanPage,
    page2CameraIncomplete,
    page2CaptureTruncated,
    page3CaptureTooSmall,
    page3Cropped,
  );

  const fileImportFlowStep = getFileImportFlowStep(view, isFileImportPath);
  const activePrototypeStep = isFileImportPath ? fileImportFlowStep : scanFlowStep;
  const activePrototypeLastStep = isFileImportPath
    ? LAST_FILE_IMPORT_STEP
    : LAST_SCAN_FLOW_STEP;

  const reviewPageIndicator = `Seite ${scanPage}`;
  const reviewDocumentPageId = getDocumentPageId(scanPage);

  const reviewPreviewVariant: ProcessedPagePreviewVariant =
    scanPage === 2 && page2CaptureTruncated
      ? "cutOff"
      : scanPage === 3 && page3CaptureTooSmall
        ? "tooSmall"
        : "default";

  useEffect(() => {
    if (activePrototypeStep === null) {
      onScanPrototypeControls?.(null);
      return;
    }

    onScanPrototypeControls?.({
      canRetreat: isFileImportPath
        ? activePrototypeStep >= 0
        : activePrototypeStep > 0,
      canAdvance: activePrototypeStep < activePrototypeLastStep,
      retreat: isFileImportPath ? retreatFileImportFlow : retreatScanFlow,
      advance: isFileImportPath ? advanceFileImportFlow : advanceScanFlow,
    });
  }, [
    activePrototypeStep,
    activePrototypeLastStep,
    isFileImportPath,
    onScanPrototypeControls,
    retreatScanFlow,
    advanceScanFlow,
    retreatFileImportFlow,
    advanceFileImportFlow,
  ]);

  useEffect(() => {
    if (view !== "processing" || !processingAutoAdvance.current) return;

    const timer = window.setTimeout(() => {
      if (processingNextView.current === "review" && scanPage === 2) {
        setPage2CaptureTruncated(false);
      }
      setView(processingNextView.current);
      processingAutoAdvance.current = false;
    }, PROCESSING_AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [view, scanPage]);

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

  if (view === "device-source") {
    return (
      <ScanDeviceSourceChooser onSelectFile={handleDeviceSourceSelectFile} />
    );
  }

  if (view === "device-picker") {
    return (
      <ScanDeviceFilePicker
        onSelectDocument={handleFilePickerSelectDocument}
        documentPageId={scanPage === 5 ? "P4" : "P1"}
      />
    );
  }

  if (view === "camera") {
    return (
      <ScanCamera
        onClose={handleBackFromCamera}
        onCapture={handleCapture}
        positioningState={positioningState}
        documentPageId={getDocumentPageId(scanPage)}
        incompleteCapture={scanPage === 2 && page2CameraIncomplete}
        tooFarCapture={scanPage === 3}
        duplicateCapture={scanPage === 4}
        showDeviceAffordance={scanPage === 5}
        onDeviceAffordanceClick={handleSessionDeviceAffordance}
        emptyViewport={scanPage === 5}
      />
    );
  }

  if (view === "processing") {
    return (
      <ScanProcessing
        message={
          processingFromDeviceUpload
            ? "Seite wird hinzugefügt …"
            : "Aufnahme wird verarbeitet …"
        }
      />
    );
  }

  if (view === "warning") {
    const warningVariant =
      scanPage === 4 ? "duplicate" : scanPage === 3 ? "tooFar" : "truncated";

    return (
      <ScanQualityWarning
        variant={warningVariant}
        previewPageId={getDocumentPageId(scanPage)}
        onRetake={
          scanPage === 4
            ? handleRetakePage4Camera
            : scanPage === 3
              ? handleRetakePage3Camera
              : handleRetakePage2Camera
        }
        onUseAnyway={handleWarningUseAnyway}
      />
    );
  }

  if (view === "crop") {
    return (
      <ScanCropEditor onCancel={handleCropCancel} onApply={handleCropApply} />
    );
  }

  if (view === "document-review") {
    return (
      <ScanDocumentReview
        documentName={documentName}
        onDocumentNameChange={setDocumentName}
        pages={assembledPages}
        onBack={handleDocumentReviewBack}
        onRestart={handleDocumentReviewRestart}
        onFinish={handleDocumentReviewFinish}
        onAddPage={handleDocumentReviewAddPage}
      />
    );
  }

  if (view === "review") {
    return (
      <ScanReview
        pageIndicator={reviewPageIndicator}
        previewVariant={reviewPreviewVariant}
        previewPageId={reviewDocumentPageId}
        onRetake={
          scanPage === 2 && page2CaptureTruncated
            ? handleRetakePage2Camera
            : undefined
        }
        onCrop={
          scanPage === 3 && (page3CaptureTooSmall || page3Cropped)
            ? () => setView("crop")
            : undefined
        }
        onAddPage={
          scanPage === 1 ||
          (scanPage === 2 && !page2CaptureTruncated) ||
          scanPage === 3 ||
          scanPage === 4
            ? handleAddPage
            : undefined
        }
        onFinish={
          scanPage === 5 || (scanPage === 6 && returnToDocumentReview)
            ? handleFinishSinglePageReview
            : undefined
        }
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
                    uploadedCount={documentUploadCounts[doc.id] ?? 0}
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
        onSelectFile={goToFileImportFlow}
      />
    </div>
  );
}
