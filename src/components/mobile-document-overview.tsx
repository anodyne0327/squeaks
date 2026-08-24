import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  File,
  ScanLine,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MobileFormfixHeader } from "@/components/mobile-formfix-header";
import { MobileOverviewUploadedFiles } from "@/components/mobile-overview-uploaded-files";
import {
  mobileDocumentOverviewSections,
  type MobileOverviewDocument,
} from "@/data/mobile-document-overview-data";

function JoinedUploadScanControl() {
  return (
    <div className="flex overflow-hidden rounded-md border">
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-1.5 border-r px-2 py-2 text-[11px]"
      >
        <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Hochladen
      </button>
      <button
        type="button"
        className="flex flex-1 items-center justify-center gap-1.5 bg-muted px-2 py-2 text-[11px] font-bold"
      >
        <ScanLine className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Scannen
      </button>
    </div>
  );
}

function DocumentRequirement({ document }: { document: MobileOverviewDocument }) {
  const hasUploads = document.files.length > 0;

  return (
    <div className="space-y-3 px-3 py-4">
      <div className="flex items-start gap-2">
        {hasUploads ? (
          <div
            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
            aria-hidden
          >
            <Check className="h-2.5 w-2.5" />
          </div>
        ) : (
          <span className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-bold leading-snug">{document.label}</p>
          <Badge
            variant={document.badge === "Pflicht" ? "secondary" : "outline"}
            className="text-[10px]"
          >
            {document.badge}
          </Badge>
          {document.note && (
            <p className="pt-0.5 text-[11px] leading-snug text-muted-foreground">
              {document.note}
            </p>
          )}
        </div>
      </div>

      <JoinedUploadScanControl />
      <MobileOverviewUploadedFiles files={document.files} />
    </div>
  );
}

function OverviewSection({
  title,
  completionBadge,
  sectionLink,
  documents,
  expanded,
  onToggle,
}: {
  title: string;
  completionBadge: string;
  sectionLink: string;
  documents: MobileOverviewDocument[];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-md border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-3 text-left"
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        )}
        <File className="h-4 w-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 text-sm font-bold">{title}</span>
        <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px]">
          {completionBadge}
        </span>
      </button>

      {expanded && (
        <div className="border-t bg-muted/30 px-3 pb-3 pt-2">
          <button
            type="button"
            className="mb-3 text-[10px] font-bold uppercase tracking-wide underline underline-offset-2"
          >
            {sectionLink}
          </button>
          <div className="divide-y rounded-md border bg-background">
            {documents.map((document) => (
              <DocumentRequirement key={document.id} document={document} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function MobileDocumentOverview() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <MobileFormfixHeader />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <h1 className="pb-5 text-lg font-bold leading-snug">
          Ihre Dokumente im Überblick
        </h1>

        <div className="space-y-3">
          {mobileDocumentOverviewSections.map((section) => (
            <OverviewSection
              key={section.title}
              title={section.title}
              completionBadge={section.completionBadge}
              sectionLink={section.sectionLink}
              documents={section.documents}
              expanded={expandedSections.has(section.title)}
              onToggle={() => toggleSection(section.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
