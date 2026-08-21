import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function QrCodePlaceholder() {
  // Deterministic pseudo-random pattern for a realistic-looking QR placeholder
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
          (x < 7 && y >= size - 7 && (x === 0 || x === 6 || y === size - 7 || y === size - 1)));
      const inCornerCenter =
        inCorner &&
        ((x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
          (x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4) ||
          (x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3));
      cells[y][x] =
        inCornerRing || inCornerCenter || ((x * 7 + y * 13 + x * y) % 5 < 2 && !inCorner);
    }
  }

  return (
    <div className="mx-auto aspect-square w-48 border-2 border-foreground p-2">
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
    </div>
  );
}

export function HandoverModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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

          <QrCodePlaceholder />

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
