import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export default function MobilePrototype() {
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

      {/* Centered mobile viewport (empty for now) */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="h-[812px] w-[375px] overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-background" />
      </div>
    </div>
  );
}
