import { Menu } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PROGRESS_PERCENT = 29;

export function MobileFormfixHeader() {
  return (
    <header className="sticky top-0 z-10 shrink-0 border-b bg-background px-3 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 items-center" aria-hidden>
          <div className="relative h-7 w-7">
            <div className="absolute left-0 top-0.5 h-5 w-5 rounded-full border-2 border-foreground" />
            <div className="absolute left-2 top-0 h-5 w-5 rounded-full border-2 border-foreground/50 bg-background" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <Progress value={PROGRESS_PERCENT} className="h-1.5" />
          <p className="text-right text-[10px] text-muted-foreground">
            {PROGRESS_PERCENT}%
          </p>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
          aria-label="Menü"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
