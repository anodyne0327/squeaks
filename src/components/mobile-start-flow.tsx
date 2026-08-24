import { useState } from "react";
import { MobileDocumentOverview } from "@/components/mobile-document-overview";
import { ScanIntroduction } from "@/components/scan-introduction";

type MobileStartView = "overview" | "scan-intro";

export function MobileStartFlow() {
  const [view, setView] = useState<MobileStartView>("overview");
  const [, setActiveDocId] = useState<string | null>(null);

  return (
    <div className="relative h-full">
      <div className={view === "overview" ? "flex h-full flex-col" : "hidden"}>
        <MobileDocumentOverview
          onScan={(docId) => {
            setActiveDocId(docId);
            setView("scan-intro");
          }}
        />
      </div>

      {view === "scan-intro" && (
        <ScanIntroduction
          onBack={() => setView("overview")}
          onStartScan={() => {}}
          backAriaLabel="Zurück zur Dokumentenübersicht"
        />
      )}
    </div>
  );
}
