import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { UploadCenter } from "@/components/upload-center";

const prototypeNavButtonClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-dashed border-foreground/35 text-muted-foreground hover:border-foreground/60 hover:text-foreground";

export default function MobilePrototype() {
  const [searchParams] = useSearchParams();
  const highlightDocId = searchParams.get("doc") ?? undefined;
  const [scanPrototypeControls, setScanPrototypeControls] = useState<{
    advance: () => void;
    retreat: () => void;
    canAdvance: boolean;
    canRetreat: boolean;
  } | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      {/* Prototype tooling bar */}
      <div className="border-b bg-background px-6 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to start
        </Link>
      </div>

      {/* Centered mobile viewport */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex items-center gap-8">
          {scanPrototypeControls?.canRetreat && (
            <button
              type="button"
              onClick={scanPrototypeControls.retreat}
              className={prototypeNavButtonClass}
              aria-label="Vorheriger Scan-Zustand (Prototyp)"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="h-[812px] w-[375px] shrink-0 overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-background">
            <UploadCenter
              highlightDocId={highlightDocId}
              onScanPrototypeControls={setScanPrototypeControls}
            />
          </div>

          {scanPrototypeControls?.canAdvance && (
            <button
              type="button"
              onClick={scanPrototypeControls.advance}
              className={prototypeNavButtonClass}
              aria-label="Nächster Scan-Zustand (Prototyp)"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
