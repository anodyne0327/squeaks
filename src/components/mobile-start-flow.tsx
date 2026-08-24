import { useCallback, useEffect, useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { DocumentPageId } from "@/components/scan-document-content";
import { MobileDocumentOverview } from "@/components/mobile-document-overview";
import {
  MOBILE_START_LAST_PROTOTYPE_STEP,
  MOBILE_START_PDF_FILENAME,
  MOBILE_START_PROTOTYPE_STEPS,
  MOBILE_START_SCAN_DOC_ID,
  type MobileStartPrototypeView,
} from "@/data/mobile-start-prototype-steps";
import {
  getPhotoLibraryDocumentPageId,
  MOBILE_START_P2_BLURRY_PHOTO_ID,
  MOBILE_START_P4_PHOTO_ID,
  MOBILE_START_P5_PHOTO_ID,
  MobileStartPhotoLibrary,
} from "@/components/mobile-start-photo-library";
import { ScanCamera } from "@/components/scan-camera";
import { ScanCropEditor } from "@/components/scan-crop-editor";
import { ScanDeviceSourceChooser } from "@/components/scan-device-source-chooser";
import { ScanDocumentReview } from "@/components/scan-document-review";
import { ScanIntroduction } from "@/components/scan-introduction";
import { ScanProcessing } from "@/components/scan-processing";
import { ScanQualityWarning } from "@/components/scan-quality-warning";
import { ScanReview } from "@/components/scan-review";

const MOBILE_START_DOCUMENT_NAME = "2026_08_24_Personalausweis_oder_Reisepass";
const MOBILE_START_ASSEMBLED_PAGES: DocumentPageId[] = [
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
];
const PROCESSING_AUTO_ADVANCE_MS = 1250;

type MobileStartView = MobileStartPrototypeView;

function pageIdForNumber(pageNumber: number): DocumentPageId {
  if (pageNumber === 1) return "P1";
  if (pageNumber === 2) return "P2";
  if (pageNumber === 3) return "P3";
  if (pageNumber === 4) return "P4";
  return "P5";
}

function reviewPreviewVariant(
  reviewPreviewPageId: DocumentPageId,
  currentPage: number,
  p5Cropped: boolean,
) {
  if (reviewPreviewPageId === "P2" && currentPage === 2) return "blurry" as const;
  if (reviewPreviewPageId === "P5" && currentPage === 5 && !p5Cropped) {
    return "distant" as const;
  }
  return "default" as const;
}

export function MobileStartFlow({
  onPrototypeControls,
}: {
  onPrototypeControls?: (
    controls: {
      advance: () => void;
      retreat: () => void;
      canAdvance: boolean;
      canRetreat: boolean;
    } | null,
  ) => void;
}) {
  const [prototypeStep, setPrototypeStep] = useState(0);
  const [view, setView] = useState<MobileStartView>("overview");
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewPreviewPageId, setReviewPreviewPageId] =
    useState<DocumentPageId>("P1");
  const [p5Cropped, setP5Cropped] = useState(false);
  const [documentName, setDocumentName] = useState(MOBILE_START_DOCUMENT_NAME);
  const [finishedPdfFilename, setFinishedPdfFilename] = useState<string | null>(
    null,
  );
  const [overviewExpandedSections, setOverviewExpandedSections] = useState<
    Set<string>
  >(() => new Set());
  const [photoLibraryFromReview, setPhotoLibraryFromReview] = useState(false);
  const [sourceSelectorOpen, setSourceSelectorOpen] = useState(false);
  const processingAutoAdvance = useRef(false);

  const applyPrototypeStep = useCallback((step: number) => {
    const snapshot = MOBILE_START_PROTOTYPE_STEPS[step];
    if (!snapshot) return;

    processingAutoAdvance.current = false;
    setView(snapshot.view);
    setCurrentPage(snapshot.currentPage);
    setReviewPreviewPageId(snapshot.reviewPreviewPageId);
    setP5Cropped(snapshot.p5Cropped);
    setPhotoLibraryFromReview(snapshot.photoLibraryFromReview);
    setSourceSelectorOpen(snapshot.sourceSelectorOpen);
    setOverviewExpandedSections(new Set(snapshot.overviewExpandedSections));
    setFinishedPdfFilename(snapshot.finishedPdfFilename);
    setActiveDocId(snapshot.activeDocId);
    setDocumentName(MOBILE_START_DOCUMENT_NAME);
  }, []);

  const advancePrototype = useCallback(() => {
    setPrototypeStep((step) => Math.min(step + 1, MOBILE_START_LAST_PROTOTYPE_STEP));
  }, []);

  const retreatPrototype = useCallback(() => {
    setPrototypeStep((step) => Math.max(step - 1, 0));
  }, []);

  useEffect(() => {
    applyPrototypeStep(prototypeStep);
  }, [prototypeStep, applyPrototypeStep]);

  useEffect(() => {
    onPrototypeControls?.({
      advance: advancePrototype,
      retreat: retreatPrototype,
      canAdvance: prototypeStep < MOBILE_START_LAST_PROTOTYPE_STEP,
      canRetreat: prototypeStep > 0,
    });
    return () => onPrototypeControls?.(null);
  }, [
    prototypeStep,
    advancePrototype,
    retreatPrototype,
    onPrototypeControls,
  ]);

  const resetScanSession = () => {
    setCurrentPage(1);
    setReviewPreviewPageId("P1");
    setP5Cropped(false);
    setDocumentName(MOBILE_START_DOCUMENT_NAME);
    setPhotoLibraryFromReview(false);
    setSourceSelectorOpen(false);
  };

  const goToOverview = () => {
    resetScanSession();
    setView("overview");
  };

  const openCameraForCurrentPage = () => {
    setSourceSelectorOpen(false);
    setView("camera");
  };

  const handlePhotoSelect = (photoId: string) => {
    if (currentPage === 5) {
      if (photoId === MOBILE_START_P5_PHOTO_ID) {
        setReviewPreviewPageId("P5");
        setP5Cropped(false);
        setPhotoLibraryFromReview(false);
        setView("review");
      }
      return;
    }

    if (currentPage === 4) {
      if (photoId === MOBILE_START_P5_PHOTO_ID) {
        setReviewPreviewPageId("P5");
        setPhotoLibraryFromReview(false);
        setView("review");
        return;
      }
      if (photoLibraryFromReview && photoId === MOBILE_START_P4_PHOTO_ID) {
        setReviewPreviewPageId("P4");
        setPhotoLibraryFromReview(false);
        setView("review");
        return;
      }
      return;
    }

    if (currentPage === 2 && photoId === MOBILE_START_P2_BLURRY_PHOTO_ID) {
      setReviewPreviewPageId("P2");
      setView("quality-warning");
      return;
    }

    const documentPageId = getPhotoLibraryDocumentPageId(photoId);
    if (!documentPageId) return;

    setReviewPreviewPageId(documentPageId);
    setView("review");
  };

  const handleCameraClose = () => {
    setSourceSelectorOpen(false);
    if (currentPage === 5) {
      setCurrentPage(4);
      setReviewPreviewPageId("P4");
      setP5Cropped(false);
      setView("review");
      return;
    }
    if (currentPage === 4) {
      setCurrentPage(3);
      setReviewPreviewPageId("P3");
      setView("review");
      return;
    }
    if (currentPage === 3) {
      setCurrentPage(2);
      setReviewPreviewPageId("P2");
      setView("review");
      return;
    }
    if (currentPage === 2) {
      setCurrentPage(1);
      setReviewPreviewPageId("P1");
      setView("review");
      return;
    }
    setView("scan-intro");
  };

  const handleFinishDocument = () => {
    processingAutoAdvance.current = true;
    setView("processing");
  };

  useEffect(() => {
    if (view !== "processing" || !processingAutoAdvance.current) return;

    const timer = window.setTimeout(() => {
      setFinishedPdfFilename(MOBILE_START_PDF_FILENAME);
      setOverviewExpandedSections(new Set(["Antragstellung"]));
      resetScanSession();
      setView("overview");
      processingAutoAdvance.current = false;
    }, PROCESSING_AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [view]);

  const cameraPageId = pageIdForNumber(currentPage);
  const extraFilesByDocumentId = finishedPdfFilename
    ? { [MOBILE_START_SCAN_DOC_ID]: [finishedPdfFilename] }
    : undefined;

  return (
    <div className="relative h-full">
      <div className={view === "overview" ? "flex h-full flex-col" : "hidden"}>
        <MobileDocumentOverview
          onScan={(docId) => {
            setActiveDocId(docId);
            resetScanSession();
            setView("scan-intro");
          }}
          extraFilesByDocumentId={extraFilesByDocumentId}
          expandedSections={
            overviewExpandedSections.size > 0
              ? overviewExpandedSections
              : undefined
          }
        />
      </div>

      {view === "scan-intro" && (
        <ScanIntroduction
          onBack={goToOverview}
          onStartScan={() => {
            resetScanSession();
            openCameraForCurrentPage();
          }}
          backAriaLabel="Zurück zur Dokumentenübersicht"
        />
      )}

      {view === "camera" && (
        <div className="relative h-full">
          <ScanCamera
            onClose={handleCameraClose}
            onCapture={() => {}}
            positioningState={3}
            documentPageId={cameraPageId}
            emptyViewport
            showDetectionFrame
            onDeviceAffordanceClick={() => setSourceSelectorOpen(true)}
          />
          {sourceSelectorOpen && (
            <ScanDeviceSourceChooser
              photoLibraryEnabled
              onSelectPhotoLibrary={() => {
                setPhotoLibraryFromReview(false);
                setSourceSelectorOpen(false);
                setView("photo-library");
              }}
              onDismiss={() => setSourceSelectorOpen(false)}
            />
          )}
        </div>
      )}

      {view === "photo-library" && (
        <MobileStartPhotoLibrary
          onBack={() => {
            if (photoLibraryFromReview) {
              setView("review");
              return;
            }
            openCameraForCurrentPage();
          }}
          onSelectPhoto={handlePhotoSelect}
        />
      )}

      {view === "quality-warning" && (
        <ScanQualityWarning
          variant="blurry"
          previewPageId="P2"
          onRetake={openCameraForCurrentPage}
          onUseAnyway={() => setView("review")}
        />
      )}

      {view === "crop" && (
        <ScanCropEditor
          pageId="P5"
          onCancel={() => setView("review")}
          onApply={() => {
            setP5Cropped(true);
            setView("review");
          }}
        />
      )}

      {view === "review" && (
        <ScanReview
          pageIndicator={`Seite ${currentPage}`}
          previewPageId={reviewPreviewPageId}
          previewVariant={reviewPreviewVariant(
            reviewPreviewPageId,
            currentPage,
            p5Cropped,
          )}
          retakeLabel="Anderes auswählen"
          retakeIcon={ImageIcon}
          onRetake={() => {
            setPhotoLibraryFromReview(true);
            setView("photo-library");
          }}
          onAddPage={
            currentPage === 1
              ? () => {
                  setCurrentPage(2);
                  openCameraForCurrentPage();
                }
              : currentPage === 2
                ? () => {
                    setCurrentPage(3);
                    openCameraForCurrentPage();
                  }
                : currentPage === 3
                  ? () => {
                      setCurrentPage(4);
                      openCameraForCurrentPage();
                    }
                  : currentPage === 4 && reviewPreviewPageId === "P4"
                    ? () => {
                        setCurrentPage(5);
                        setP5Cropped(false);
                        openCameraForCurrentPage();
                      }
                    : undefined
          }
          onFinish={
            currentPage === 5 &&
            reviewPreviewPageId === "P5" &&
            p5Cropped
              ? () => setView("document-review")
              : undefined
          }
          onCrop={
            currentPage === 5 && reviewPreviewPageId === "P5"
              ? () => setView("crop")
              : undefined
          }
          onAbortScan={goToOverview}
        />
      )}

      {view === "document-review" && (
        <ScanDocumentReview
          documentName={documentName}
          onDocumentNameChange={setDocumentName}
          pages={MOBILE_START_ASSEMBLED_PAGES}
          onBack={() => {
            setCurrentPage(5);
            setReviewPreviewPageId("P5");
            setView("review");
          }}
          onRestart={() => {}}
          onFinish={handleFinishDocument}
          onAddPage={() => {}}
        />
      )}

      {view === "processing" && (
        <ScanProcessing message="Dokument wird gespeichert …" />
      )}
    </div>
  );
}
