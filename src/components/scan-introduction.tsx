import { ChevronLeft, FileStack, Lightbulb, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SCAN_TIPS = [
  {
    icon: FileStack,
    title: "Dokument vollständig erfassen",
    text: "Alle Ecken und Ränder sollten sichtbar sein.",
  },
  {
    icon: Smartphone,
    title: "Smartphone gerade über das Dokument halten",
    text: "Vermeiden Sie schräge Aufnahmen.",
  },
  {
    icon: Lightbulb,
    title: "Für gute Beleuchtung sorgen",
    text: "Vermeiden Sie Schatten und Spiegelungen.",
  },
];

export function ScanIntroduction({
  onBack,
  onStartScan,
  backAriaLabel = "Zurück zum Upload Center",
}: {
  onBack: () => void;
  onStartScan: () => void;
  backAriaLabel?: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center text-muted-foreground hover:text-foreground"
          aria-label={backAriaLabel}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-lg font-bold">Dokument richtig scannen</h1>
            <p className="text-sm text-muted-foreground">
              So erhalten Sie ein gut lesbares Dokument:
            </p>
          </div>

          <div className="space-y-4">
            {SCAN_TIPS.map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <tip.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border p-4">
            <p className="text-sm font-bold">Mehrseitiges Dokument?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Scannen Sie jede Seite einzeln. Weitere Seiten können Sie
              anschließend hinzufügen.
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t px-4 py-4">
        <Button className="w-full" onClick={onStartScan}>
          Scannen starten
        </Button>
        <button
          type="button"
          className="w-full cursor-pointer py-1 text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Nicht mehr anzeigen
        </button>
      </div>
    </div>
  );
}
