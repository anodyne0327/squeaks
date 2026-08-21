import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  uploadCenterSections,
  uploadStatusText,
} from "@/data/upload-center-documents";

const INTRO_TITLE = "Dokumente hinzufügen";
const INTRO_TEXT =
  "Scannen oder laden Sie hier Dokumente mit Ihrem Smartphone hoch. Sie werden automatisch Ihrem Antrag hinzugefügt.";

function DocumentRow({
  id,
  label,
  uploadedCount,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  uploadedCount: number;
  selected: boolean;
  onSelect: () => void;
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
          onClick={onSelect}
        >
          <Plus className="h-3.5 w-3.5" />
          Hinzufügen
        </Button>
      </div>
    </div>
  );
}

export function UploadCenter({ highlightDocId }: { highlightDocId?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    highlightDocId ?? null,
  );
  const [showStickyHeader, setShowStickyHeader] = useState(!!highlightDocId);

  const updateStickyHeader = () => {
    const scrollEl = scrollRef.current;
    const introEl = introRef.current;
    if (!scrollEl || !introEl) return;
    setShowStickyHeader(scrollEl.scrollTop > introEl.offsetHeight - 8);
  };

  useEffect(() => {
    if (!highlightDocId) return;

    setSelectedId(highlightDocId);

    const target = document.getElementById(highlightDocId);
    if (target) {
      target.scrollIntoView({ block: "start" });
    }
    setShowStickyHeader(true);
  }, [highlightDocId]);

  return (
    <div className="flex h-full flex-col">
      {showStickyHeader && (
        <div className="shrink-0 border-b bg-background px-4 py-2.5">
          <p className="text-sm font-bold">{INTRO_TITLE}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {INTRO_TEXT}
          </p>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={updateStickyHeader}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <div ref={introRef} className="space-y-2 px-4 pb-6 pt-5">
          <h1 className="text-lg font-bold">{INTRO_TITLE}</h1>
          <p className="text-sm text-muted-foreground">{INTRO_TEXT}</p>
        </div>

        <div className="space-y-6 px-2 pb-8">
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
                  onSelect={() => setSelectedId(doc.id)}
                />
              ))}
            </div>
          </section>
        ))}
        </div>
      </div>
    </div>
  );
}
