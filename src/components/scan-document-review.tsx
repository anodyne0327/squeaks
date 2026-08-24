import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Pencil, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProcessedDocumentContent,
  type DocumentPageId,
} from "@/components/scan-document-content";

function DocumentPageBlock({ pageId }: { pageId: DocumentPageId }) {
  return (
    <div className="border border-foreground/40 bg-background p-4">
      <ProcessedDocumentContent pageId={pageId} />
    </div>
  );
}

function BottomAction({
  icon: Icon,
  label,
  onClick,
  emphasized = false,
}: {
  icon: typeof Check;
  label: string;
  onClick?: () => void;
  emphasized?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
    >
      {emphasized ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-foreground bg-foreground text-background">
          <Icon className="h-6 w-6" />
        </span>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="max-w-[5.5rem] text-center text-[10px] leading-tight">
        {label}
      </span>
    </button>
  );
}

export function ScanDocumentReview({
  documentName,
  onDocumentNameChange,
  pages,
  onBack,
  onRestart,
  onFinish,
  onAddPage,
}: {
  documentName: string;
  onDocumentNameChange: (name: string) => void;
  pages: DocumentPageId[];
  onBack: () => void;
  onRestart: () => void;
  onFinish: () => void;
  onAddPage: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(documentName);
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);

  useEffect(() => {
    setEditedName(documentName);
  }, [documentName]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const index = Number(
          visible[0].target.getAttribute("data-page-index") ?? 0,
        );
        setCurrentPage(index + 1);
      },
      { root, threshold: [0.35, 0.5, 0.75] },
    );

    pageRefs.current.forEach((page) => {
      if (page) observer.observe(page);
    });

    return () => observer.disconnect();
  }, [pages.length]);

  const saveDocumentName = () => {
    const trimmed = editedName.trim();
    if (trimmed) onDocumentNameChange(trimmed);
    setIsEditingName(false);
  };

  return (
    <div className="relative flex h-full flex-col bg-muted">
      <div className="shrink-0 border-b bg-background px-3 py-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Zurück"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(event) => setEditedName(event.target.value)}
                onBlur={saveDocumentName}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveDocumentName();
                  if (event.key === "Escape") {
                    setEditedName(documentName);
                    setIsEditingName(false);
                  }
                }}
                className="w-full border-b bg-transparent pb-0.5 text-sm font-bold outline-none"
                autoFocus
              />
            ) : (
              <div className="flex items-start gap-1.5">
                <p className="min-w-0 flex-1 break-all text-sm font-bold leading-snug">
                  {documentName}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Dokumentname bearbeiten"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto px-4 py-4"
        >
          <div className="space-y-4 pb-4">
            {pages.map((pageId, index) => (
              <div
                key={`${pageId}-${index}`}
                ref={(element) => {
                  pageRefs.current[index] = element;
                }}
                data-page-index={index}
              >
                <DocumentPageBlock pageId={pageId} />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border bg-background px-3 py-1 text-xs font-bold">
          {currentPage}/{pages.length}
        </div>
      </div>

      <div className="shrink-0 border-t bg-background px-4 py-4">
        <div className="flex items-end justify-between gap-2">
          <BottomAction
            icon={RefreshCw}
            label="Neu beginnen"
            onClick={() => setRestartConfirmOpen(true)}
          />
          <BottomAction
            icon={Check}
            label="Fertig"
            emphasized
            onClick={onFinish}
          />
          <BottomAction icon={Plus} label="Seite hinzufügen" onClick={onAddPage} />
        </div>
      </div>

      {restartConfirmOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Schließen"
            onClick={() => setRestartConfirmOpen(false)}
          />
          <div className="relative w-full max-w-[280px] rounded-lg border bg-background p-4">
            <h2 className="text-base font-bold">Dokument neu beginnen?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Alle bisher hinzugefügten Seiten werden verworfen.
            </p>
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setRestartConfirmOpen(false)}
              >
                Abbrechen
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setRestartConfirmOpen(false);
                  onRestart();
                }}
              >
                Neu beginnen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
