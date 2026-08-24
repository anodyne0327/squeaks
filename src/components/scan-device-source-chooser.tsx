export function ScanDeviceSourceChooser({
  onSelectFile,
}: {
  onSelectFile: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-end bg-foreground/80">
      <div className="rounded-t-2xl border-t bg-muted px-4 pb-10 pt-3">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-foreground/25" />

        <div className="overflow-hidden rounded-lg border bg-background">
          <button
            type="button"
            className="w-full border-b px-4 py-3.5 text-left text-sm text-muted-foreground"
            disabled
          >
            Fotomediathek
          </button>
          <button
            type="button"
            className="w-full border-b px-4 py-3.5 text-left text-sm text-muted-foreground"
            disabled
          >
            Foto aufnehmen
          </button>
          <button
            type="button"
            onClick={onSelectFile}
            className="w-full px-4 py-3.5 text-left text-sm font-bold"
          >
            Datei auswählen
          </button>
        </div>
      </div>
    </div>
  );
}
