import { useState } from "react";
import { Check, Crop, Plus, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProcessedPagePreview } from "@/components/scan-document-preview";
import { ScanFlowHeader } from "@/components/scan-flow-header";

function PageAction({
  icon: Icon,
  label,
  onClick,
  emphasized = false,
}: {
  icon: LucideIcon;
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

export function ScanReview({
  pageIndicator,
  cutOff = false,
  onRetake,
  onAddPage,
  onAbortScan,
}: {
  pageIndicator: string;
  cutOff?: boolean;
  onRetake?: () => void;
  onAddPage?: () => void;
  onAbortScan: () => void;
}) {
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col bg-muted">
      <ScanFlowHeader
        onClose={() => setExitConfirmOpen(true)}
        variant="light"
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-2">
        <div className="relative mx-auto flex min-h-0 w-full max-w-[300px] flex-1 flex-col">
          <Crop
            className="absolute right-0 top-0 h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <div className="flex min-h-0 flex-1 items-center justify-center pt-6">
            <ProcessedPagePreview cutOff={cutOff} />
          </div>
        </div>

        <p className="shrink-0 py-3 text-center text-sm font-bold">
          {pageIndicator}
        </p>
      </div>

      <div className="shrink-0 border-t bg-background px-4 py-4">
        <div className="flex items-end justify-between gap-2">
          <PageAction
            icon={RotateCcw}
            label="Erneut aufnehmen"
            onClick={onRetake}
          />
          <PageAction
            icon={Plus}
            label="Seite hinzufügen"
            emphasized
            onClick={onAddPage}
          />
          <PageAction icon={Check} label="Fertig" />
        </div>
      </div>

      {exitConfirmOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Schließen"
            onClick={() => setExitConfirmOpen(false)}
          />
          <div className="relative w-full max-w-[280px] rounded-lg border bg-background p-4">
            <h2 className="text-base font-bold">Scannen abbrechen?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bereits gescannte Seiten werden nicht gespeichert.
            </p>
            <div className="mt-4 space-y-2">
              <Button
                className="w-full"
                onClick={() => setExitConfirmOpen(false)}
              >
                Weiterscannen
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onAbortScan}
              >
                Scannen abbrechen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
