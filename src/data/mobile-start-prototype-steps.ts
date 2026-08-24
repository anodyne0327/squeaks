import type { DocumentPageId } from "@/components/scan-document-content";

export type MobileStartPrototypeView =
  | "overview"
  | "scan-intro"
  | "camera"
  | "photo-library"
  | "quality-warning"
  | "crop"
  | "review"
  | "document-review"
  | "processing";

export type MobileStartPrototypeSnapshot = {
  view: MobileStartPrototypeView;
  currentPage: number;
  reviewPreviewPageId: DocumentPageId;
  p5Cropped: boolean;
  photoLibraryFromReview: boolean;
  sourceSelectorOpen: boolean;
  overviewExpandedSections: string[];
  finishedPdfFilename: string | null;
  activeDocId: string | null;
};

export const MOBILE_START_SCAN_DOC_ID = "antragstellung-personalausweis";
export const MOBILE_START_PDF_FILENAME =
  "2026_08_24_Personalausweis_oder_Reisepass.pdf";

const docId = MOBILE_START_SCAN_DOC_ID;

function step(
  overrides: Partial<MobileStartPrototypeSnapshot> &
    Pick<MobileStartPrototypeSnapshot, "view">,
): MobileStartPrototypeSnapshot {
  return {
    currentPage: 1,
    reviewPreviewPageId: "P1",
    p5Cropped: false,
    photoLibraryFromReview: false,
    sourceSelectorOpen: false,
    overviewExpandedSections: [],
    finishedPdfFilename: null,
    activeDocId: null,
    ...overrides,
  };
}

/** Pre-programmed Start-from-mobile journey for prototype ←/→ navigation. */
export const MOBILE_START_PROTOTYPE_STEPS: MobileStartPrototypeSnapshot[] = [
  step({ view: "overview" }),
  step({ view: "overview", overviewExpandedSections: ["Antragstellung"] }),
  step({ view: "scan-intro", activeDocId: docId }),
  step({ view: "camera", currentPage: 1, activeDocId: docId }),
  step({ view: "photo-library", currentPage: 1, activeDocId: docId }),
  step({
    view: "review",
    currentPage: 1,
    reviewPreviewPageId: "P1",
    activeDocId: docId,
  }),
  step({ view: "camera", currentPage: 2, activeDocId: docId }),
  step({ view: "photo-library", currentPage: 2, activeDocId: docId }),
  step({
    view: "quality-warning",
    currentPage: 2,
    reviewPreviewPageId: "P2",
    activeDocId: docId,
  }),
  step({
    view: "review",
    currentPage: 2,
    reviewPreviewPageId: "P2",
    activeDocId: docId,
  }),
  step({ view: "camera", currentPage: 3, activeDocId: docId }),
  step({ view: "photo-library", currentPage: 3, activeDocId: docId }),
  step({
    view: "review",
    currentPage: 3,
    reviewPreviewPageId: "P3",
    activeDocId: docId,
  }),
  step({ view: "camera", currentPage: 4, activeDocId: docId }),
  step({ view: "photo-library", currentPage: 4, activeDocId: docId }),
  step({
    view: "review",
    currentPage: 4,
    reviewPreviewPageId: "P5",
    activeDocId: docId,
  }),
  step({
    view: "photo-library",
    currentPage: 4,
    reviewPreviewPageId: "P5",
    photoLibraryFromReview: true,
    activeDocId: docId,
  }),
  step({
    view: "review",
    currentPage: 4,
    reviewPreviewPageId: "P4",
    activeDocId: docId,
  }),
  step({ view: "camera", currentPage: 5, activeDocId: docId }),
  step({ view: "photo-library", currentPage: 5, activeDocId: docId }),
  step({
    view: "review",
    currentPage: 5,
    reviewPreviewPageId: "P5",
    activeDocId: docId,
  }),
  step({
    view: "crop",
    currentPage: 5,
    reviewPreviewPageId: "P5",
    activeDocId: docId,
  }),
  step({
    view: "review",
    currentPage: 5,
    reviewPreviewPageId: "P5",
    p5Cropped: true,
    activeDocId: docId,
  }),
  step({ view: "document-review", activeDocId: docId }),
  step({ view: "processing", activeDocId: docId }),
  step({
    view: "overview",
    overviewExpandedSections: ["Antragstellung"],
    finishedPdfFilename: MOBILE_START_PDF_FILENAME,
    activeDocId: docId,
  }),
];

export const MOBILE_START_LAST_PROTOTYPE_STEP =
  MOBILE_START_PROTOTYPE_STEPS.length - 1;
