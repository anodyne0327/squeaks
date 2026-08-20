import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Folder, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FakeFile = {
  name: string;
  type: "pdf" | "image";
};

const fakeFiles: FakeFile[] = [
  { name: "Kontoauszug_Juni_2026.pdf", type: "pdf" },
  { name: "Kontoauszug_Juli_2026.pdf", type: "pdf" },
  { name: "Bescheid.pdf", type: "pdf" },
  { name: "IMG_2048.jpg", type: "image" },
  { name: "Kontoauszug_Foto.jpg", type: "image" },
  { name: "Scan_001.png", type: "image" },
];

export function FileSelectorModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (filename: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  // Reset the selection whenever the picker is (re)opened.
  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Datei auswählen</DialogTitle>
        </DialogHeader>

        {/* Location / folder header */}
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Folder className="ml-1 h-4 w-4" />
          <span className="font-bold">mobility</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Nur PDF-Dateien
          </span>
        </div>

        {/* File list */}
        <div className="h-64 overflow-y-auto rounded-md border">
          <div className="divide-y">
            {fakeFiles.map((file) => {
              const isPdf = file.type === "pdf";
              const isSelected = selected === file.name;
              return (
                <button
                  key={file.name}
                  type="button"
                  disabled={!isPdf}
                  onClick={() => isPdf && setSelected(file.name)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${
                    isPdf
                      ? "hover:bg-muted"
                      : "cursor-not-allowed opacity-40"
                  } ${isSelected ? "bg-foreground text-background hover:bg-foreground" : ""}`}
                >
                  {isPdf ? (
                    <FileText className="h-4 w-4 shrink-0" />
                  ) : (
                    <Image className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate">{file.name}</span>
                  {isSelected && <Check className="ml-auto h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              onConfirm(selected);
              onOpenChange(false);
            }}
          >
            Öffnen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
