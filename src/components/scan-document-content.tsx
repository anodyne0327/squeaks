export type DocumentPageId = "P1" | "P2" | "P3" | "P4";

export function getDocumentPageId(scanPage: number): DocumentPageId {
  if (scanPage === 1) return "P1";
  if (scanPage === 2) return "P2";
  if (scanPage === 5) return "P4";
  return "P3";
}

export function DocumentPageContent({
  pageId,
  lineCount = 5,
}: {
  pageId: DocumentPageId;
  lineCount?: number;
}) {
  return (
    <div className="space-y-1.5 pt-1">
      <p className="text-sm font-bold text-foreground/45">{pageId}</p>
      {Array.from({ length: lineCount }, (_, i) => (
        <div
          key={i}
          className={`h-1 bg-foreground/20 ${i % 3 === 1 ? "w-4/5" : i % 3 === 2 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function ProcessedDocumentContent({
  pageId,
}: {
  pageId: DocumentPageId;
}) {
  return (
    <div className="space-y-2 pt-2">
      <p className="text-base font-bold text-foreground/45">{pageId}</p>
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          className={`h-1 bg-foreground/20 ${i % 4 === 1 ? "w-4/5" : i % 4 === 2 ? "w-3/5" : i % 4 === 3 ? "w-11/12" : "w-full"}`}
        />
      ))}
    </div>
  );
}
