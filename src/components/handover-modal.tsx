import { useEffect, useState } from "react";
import { ArrowRight, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function QrCodeGrid() {
  const size = 21;
  const cells: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    cells[y] = [];
    for (let x = 0; x < size; x++) {
      const inCorner =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7);
      const inCornerRing =
        inCorner &&
        (x === 0 ||
          x === 6 ||
          y === 0 ||
          y === 6 ||
          (x >= size - 7 && (x === size - 7 || x === size - 1)) ||
          (y >= size - 7 && (y === size - 7 || y === size - 1)) ||
          (x < 7 &&
            y >= size - 7 &&
            (x === 0 || x === 6 || y === size - 7 || y === size - 1)));
      const inCornerCenter =
        inCorner &&
        ((x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
          (x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4) ||
          (x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3));
      cells[y][x] =
        inCornerRing ||
        inCornerCenter ||
        ((x * 7 + y * 13 + x * y) % 5 < 2 && !inCorner);
    }
  }

  return (
    <div
      className="grid h-full w-full gap-0"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells.flatMap((row, y) =>
        row.map((filled, x) => (
          <div
            key={`${x}-${y}`}
            className={filled ? "bg-foreground" : "bg-background"}
          />
        )),
      )}
    </div>
  );
}

function QrRecognitionBanner({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpenMobile}
      className="mx-auto flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-background shadow-md hover:opacity-90"
    >
      <Link2 className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs font-medium">formfix.myo.de</span>
    </button>
  );
}

export function HandoverModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [qrRecognized, setQrRecognized] = useState(false);

  useEffect(() => {
    if (open) setQrRecognized(false);
  }, [open]);

  const openMobileTab = () => {
    window.open("/mobile", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Auf dem Smartphone fortfahren</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-sm font-bold">
            Scannen Sie den QR-Code mit Ihrem Smartphone.
          </p>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setQrRecognized(true)}
              className="w-48 cursor-pointer"
            >
              <div className="aspect-square border-2 border-foreground p-2">
                <QrCodeGrid />
              </div>
            </button>

            {!qrRecognized ? (
              <p className="mt-3 w-full whitespace-nowrap text-center text-[10px] text-muted-foreground/70">
                Im Prototyp klicken, um QR-Code zu scannen
              </p>
            ) : (
              <div className="mt-3">
                <QrRecognitionBanner onOpenMobile={openMobileTab} />
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-bold">So geht&apos;s</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Öffnen Sie die Kamera auf Ihrem Smartphone.</li>
              <li>Richten Sie die Kamera auf den QR-Code.</li>
              <li>Tippen Sie auf den angezeigten Link.</li>
            </ol>
          </div>
        </div>

        {/* Prototype tooling: manual state progression */}
        <div className="flex justify-end pt-8 pb-2">
          <button
            type="button"
            className="text-xs text-muted-foreground opacity-40 hover:opacity-100"
            aria-label="Next handover state (prototype)"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
