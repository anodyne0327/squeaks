type PickerItem = {
  id: string;
  name: string;
  kind: "pdf" | "photo" | "screenshot" | "dark";
  selectable?: boolean;
};

const PICKER_ITEMS: PickerItem[] = [
  { id: "pdf-1", name: "Kontoauszug_August_2026.pdf", kind: "pdf", selectable: true },
  { id: "img-1", name: "IMG_4821.jpg", kind: "photo" },
  { id: "pdf-2", name: "Bescheid_Pflegekasse.pdf", kind: "pdf", selectable: true },
  { id: "img-2", name: "Screenshot_08-12.png", kind: "screenshot" },
  { id: "pdf-3", name: "Vollmacht_unterschrieben.pdf", kind: "pdf", selectable: true },
  { id: "img-3", name: "Feierabend.png", kind: "dark" },
];

function FakeThumbnail({ kind }: { kind: PickerItem["kind"] }) {
  if (kind === "pdf") {
    return (
      <div className="flex h-full w-full flex-col gap-1.5 bg-background p-2">
        <div className="h-2 w-8 bg-foreground/25" />
        <div className="flex-1 space-y-1">
          <div className="h-1 w-full bg-foreground/15" />
          <div className="h-1 w-4/5 bg-foreground/15" />
          <div className="h-1 w-3/5 bg-foreground/15" />
        </div>
      </div>
    );
  }

  if (kind === "screenshot") {
    return (
      <div className="flex h-full w-full flex-col gap-1 bg-background p-2">
        <div className="h-2 w-full bg-foreground/15" />
        <div className="flex-1 space-y-1">
          <div className="h-1 w-3/4 bg-foreground/20" />
          <div className="h-1 w-full bg-foreground/15" />
        </div>
      </div>
    );
  }

  if (kind === "dark") {
    return (
      <div className="flex h-full w-full flex-col justify-end gap-1 bg-foreground/80 p-2">
        <div className="h-1 w-2/3 bg-background/40" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-foreground/25" />
      <div className="absolute bottom-2 left-2 h-8 w-8 rounded-full bg-foreground/20" />
    </div>
  );
}

function PickerTile({
  item,
  onSelect,
}: {
  item: PickerItem;
  onSelect?: (filename: string) => void;
}) {
  const meta = item.name.endsWith(".pdf")
    ? "PDF · 420 KB"
    : item.name.endsWith(".png")
      ? "PNG · 1,2 MB"
      : "JPG · 2,4 MB";

  const content = (
    <>
      <div className="aspect-[4/5] w-full overflow-hidden border border-foreground/20 bg-muted">
        <FakeThumbnail kind={item.kind} />
      </div>
      <p className="mt-1.5 truncate text-[10px] leading-tight text-foreground/70">
        {item.name}
      </p>
      <p className="text-[9px] text-foreground/45">{meta}</p>
    </>
  );

  if (item.selectable && onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(item.name)}
        className="text-left hover:opacity-80"
      >
        {content}
      </button>
    );
  }

  return <div className="cursor-not-allowed opacity-40">{content}</div>;
}

export function ScanPdfFilePicker({
  onSelectPdf,
}: {
  onSelectPdf: (filename: string) => void;
}) {
  return (
    <div className="flex h-full flex-col bg-muted">
      <div className="shrink-0 border-b bg-background px-4 py-3">
        <p className="text-base font-bold">Zuletzt verwendet</p>
        <p className="text-[10px] text-muted-foreground">
          Dateien auf diesem Gerät
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {PICKER_ITEMS.map((item) => (
            <PickerTile
              key={item.id}
              item={item}
              onSelect={item.selectable ? onSelectPdf : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
