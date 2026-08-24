export function ScanDeviceSourceChooser({
  onSelectFile,
  fileSelectEnabled = false,
  onDismiss,
}: {
  onSelectFile?: () => void;
  fileSelectEnabled?: boolean;
  onDismiss: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/80"
        aria-label="Schließen"
        onClick={onDismiss}
      />
      <div className="relative rounded-t-2xl border-t bg-muted px-4 pb-10 pt-3">
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
            onClick={fileSelectEnabled ? onSelectFile : undefined}
            disabled={!fileSelectEnabled}
            className={`w-full px-4 py-3.5 text-left text-sm ${
              fileSelectEnabled ? "font-bold" : "text-muted-foreground"
            }`}
          >
            Datei auswählen
          </button>
        </div>
      </div>
    </div>
  );
}
