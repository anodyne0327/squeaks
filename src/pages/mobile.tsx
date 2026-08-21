import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { UploadCenter } from "@/components/upload-center";

const prototypeNavButtonClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-dashed border-foreground/35 text-muted-foreground hover:border-foreground/60 hover:text-foreground";

export default function MobilePrototype() {
  const [searchParams] = useSearchParams();
  const highlightDocId = searchParams.get("doc") ?? undefined;
  const [cameraPrototypeControls, setCameraPrototypeControls] = useState<{
    advancePositioning: () => void;
    retreatPositioning: () => void;
    positioningState: 1 | 2 | 3;
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
          {cameraPrototypeControls &&
            cameraPrototypeControls.positioningState > 1 && (
              <button
                type="button"
                onClick={cameraPrototypeControls.retreatPositioning}
                className={prototypeNavButtonClass}
                aria-label="Vorheriger Positionierungszustand (Prototyp)"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}

          <div className="h-[812px] w-[375px] shrink-0 overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-background">
            <UploadCenter
              highlightDocId={highlightDocId}
              onCameraPrototypeControls={setCameraPrototypeControls}
            />
          </div>

          {cameraPrototypeControls &&
            cameraPrototypeControls.positioningState < 3 && (
              <button
                type="button"
                onClick={cameraPrototypeControls.advancePositioning}
                className={prototypeNavButtonClass}
                aria-label="Nächster Positionierungszustand (Prototyp)"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
