import { ChevronLeft } from "lucide-react";
import {
  DocumentPageContent,
  type DocumentPageId,
} from "@/components/scan-document-content";

type PhotoLibraryItem = {
  id: string;
  name: string;
  kind: "photo" | "screenshot" | "document" | "dark";
  documentPageId?: DocumentPageId;
};

export const MOBILE_START_P2_BLURRY_PHOTO_ID = "lib-doc-2";
export const MOBILE_START_P4_PHOTO_ID = "lib-doc-4";
export const MOBILE_START_P5_PHOTO_ID = "lib-doc-5";

const PHOTO_LIBRARY_ITEMS: PhotoLibraryItem[] = [
  { id: "lib-1", name: "IMG_4821.jpg", kind: "photo" },
  {
    id: "lib-doc-1",
    name: "IMG_5102.jpg",
    kind: "document",
    documentPageId: "P1",
  },
  {
    id: "lib-doc-2",
    name: "Scan_Personalausweis.jpg",
    kind: "document",
    documentPageId: "P2",
  },
  { id: "lib-2", name: "IMG_3910.jpg", kind: "photo" },
  {
    id: "lib-doc-3",
    name: "IMG_5204.jpg",
    kind: "document",
    documentPageId: "P3",
  },
  {
    id: "lib-doc-4",
    name: "IMG_5301.jpg",
    kind: "document",
    documentPageId: "P4",
  },
  { id: "lib-3", name: "Feierabend.png", kind: "dark" },
  {
    id: "lib-doc-5",
    name: "IMG_5408.jpg",
    kind: "document",
    documentPageId: "P5",
  },
  { id: "lib-4", name: "Screenshot_08-12.png", kind: "screenshot" },
  { id: "lib-5", name: "IMG_2204.jpg", kind: "screenshot" },
];

export function getPhotoLibraryDocumentPageId(
  photoId: string,
): DocumentPageId | undefined {
  return PHOTO_LIBRARY_ITEMS.find((item) => item.id === photoId)?.documentPageId;
}

function PhotoThumbnail({ item }: { item: PhotoLibraryItem }) {
  if (item.kind === "document" && item.documentPageId) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background p-1.5">
        <div className="h-full w-full border border-foreground/30 bg-background p-1">
          <DocumentPageContent pageId={item.documentPageId} lineCount={6} />
        </div>
      </div>
    );
  }

  if (item.kind === "screenshot") {
    return (
      <div className="flex h-full w-full flex-col gap-1 bg-background p-1.5">
        <div className="h-1.5 w-full bg-foreground/15" />
        <div className="flex-1 space-y-1">
          <div className="h-1 w-3/4 bg-foreground/20" />
          <div className="h-1 w-full bg-foreground/15" />
          <div className="h-1 w-2/3 bg-foreground/15" />
        </div>
      </div>
    );
  }

  if (item.kind === "dark") {
    return (
      <div className="flex h-full w-full flex-col justify-end gap-1 bg-foreground/80 p-1.5">
        <div className="h-1 w-2/3 bg-background/40" />
        <div className="h-1 w-1/2 bg-background/30" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-foreground/25" />
      <div className="absolute bottom-1.5 left-1.5 h-6 w-6 rounded-full bg-foreground/20" />
      <div className="absolute right-1 top-1 h-4 w-8 bg-foreground/15" />
    </div>
  );
}

export function MobileStartPhotoLibrary({
  onBack,
  onSelectPhoto,
}: {
  onBack: () => void;
  onSelectPhoto: (photoId: string) => void;
}) {
  return (
    <div className="flex h-full flex-col bg-foreground text-background">
      <div className="flex shrink-0 items-center gap-2 border-b border-background/20 px-3 py-3">
        <button
          type="button"
          onClick={onBack}
          className="text-background/70 hover:text-background"
          aria-label="Zurück zur Kamera"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Fotomediathek</p>
          <p className="text-[10px] text-background/60">Zuletzt</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-0.5">
        <div className="grid grid-cols-3 gap-0.5">
          {PHOTO_LIBRARY_ITEMS.map((item) => {
            const isDocument = item.kind === "document";

            if (isDocument) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPhoto(item.id)}
                  className="aspect-square overflow-hidden hover:opacity-90"
                  aria-label={item.name}
                >
                  <PhotoThumbnail item={item} />
                </button>
              );
            }

            return (
              <div
                key={item.id}
                className="aspect-square overflow-hidden opacity-80"
                aria-hidden
              >
                <PhotoThumbnail item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
