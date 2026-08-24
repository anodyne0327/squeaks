import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { MobileStartFlow } from "@/components/mobile-start-flow";

const prototypeNavButtonClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-dashed border-foreground/35 text-muted-foreground hover:border-foreground/60 hover:text-foreground";

export default function MobileStartPage() {
  const [prototypeControls, setPrototypeControls] = useState<{
    advance: () => void;
    retreat: () => void;
    canAdvance: boolean;
    canRetreat: boolean;
  } | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="border-b bg-background px-6 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to start
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex items-center gap-8">
          {prototypeControls?.canRetreat && (
            <button
              type="button"
              onClick={prototypeControls.retreat}
              className={prototypeNavButtonClass}
              aria-label="Vorheriger Prototyp-Zustand (Start from mobile)"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="h-[812px] w-[375px] shrink-0 overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-background">
            <MobileStartFlow onPrototypeControls={setPrototypeControls} />
          </div>

          {prototypeControls?.canAdvance && (
            <button
              type="button"
              onClick={prototypeControls.advance}
              className={prototypeNavButtonClass}
              aria-label="Nächster Prototyp-Zustand (Start from mobile)"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
