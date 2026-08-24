import { Download, ExternalLink, Trash2 } from "lucide-react";

export function MobileOverviewUploadedFiles({ files }: { files: string[] }) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3 pt-1">
      {files.map((file) => (
        <div key={file} className="space-y-1.5">
          <p className="text-xs underline underline-offset-2">{file}</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <button
              type="button"
              className="hover:text-foreground"
              aria-label={`${file} öffnen`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="hover:text-foreground"
              aria-label={`${file} herunterladen`}
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="hover:text-foreground"
              aria-label={`${file} löschen`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
