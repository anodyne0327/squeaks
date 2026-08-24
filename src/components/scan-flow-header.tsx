import { X } from "lucide-react";

const SCAN_FLOW_TITLE = "Seite erfassen";

export function ScanFlowHeader({
  onClose,
  variant = "dark",
}: {
  onClose?: () => void;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={`relative shrink-0 px-3 py-3 ${isDark ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "hover:opacity-80" : "text-muted-foreground hover:text-foreground"}`}
          aria-label="Schließen"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      <h1 className="text-center text-sm font-bold">{SCAN_FLOW_TITLE}</h1>
    </div>
  );
}
