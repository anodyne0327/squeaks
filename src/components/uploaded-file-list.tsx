import { Download, Trash2 } from "lucide-react";

export function UploadedFileList({
  files,
  onDelete,
}: {
  files: string[];
  onDelete: (index: number) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="divide-y">
      {files.map((file, index) => (
        <div
          key={`${file}-${index}`}
          className="flex items-center justify-between gap-4 py-2"
        >
          <span className="text-sm underline underline-offset-2">{file}</span>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-foreground">
              <Download className="h-4 w-4" />
              Herunterladen
            </button>
            <button
              onClick={() => onDelete(index)}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Löschen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
