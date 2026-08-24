import {
  DocumentPageContent,
  type DocumentPageId,
} from "@/components/scan-document-content";

type PickerItem = {
  id: string;
  name: string;
  kind: "photo" | "screenshot" | "document" | "dark";
  selectable?: boolean;
};

const PICKER_ITEMS: PickerItem[] = [
  { id: "img-1", name: "IMG_4821.jpg", kind: "photo" },
  { id: "img-2", name: "Screenshot_08-12.png", kind: "screenshot" },
  {
    id: "scan-doc",
    name: "Scan_Kontoauszug.jpg",
    kind: "document",
    selectable: true,
  },
  { id: "img-3", name: "IMG_3910.jpg", kind: "photo" },
  { id: "img-4", name: "Feierabend.png", kind: "dark" },
  { id: "img-5", name: "IMG_2204.jpg", kind: "screenshot" },
];

function FakeThumbnail({
  kind,
  documentPageId = "P1",
}: {
  kind: PickerItem["kind"];
  documentPageId?: DocumentPageId;
}) {
  if (kind === "document") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background p-2">
        <div className="h-full w-full border border-foreground/30 bg-background p-1.5">
          <DocumentPageContent pageId={documentPageId} lineCount={8} />
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
          <div className="h-1 w-2/3 bg-foreground/15" />
        </div>
      </div>
    );
  }

  if (kind === "dark") {
    return (
      <div className="flex h-full w-full flex-col justify-end gap-1 bg-foreground/80 p-2">
        <div className="h-1 w-2/3 bg-background/40" />
        <div className="h-1 w-1/2 bg-background/30" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-foreground/25" />
      <div className="absolute bottom-2 left-2 h-8 w-8 rounded-full bg-foreground/20" />
      <div className="absolute right-1 top-1 h-6 w-10 bg-foreground/15" />
    </div>
  );
}

function PickerTile({
  item,
  documentPageId,
  onSelect,
}: {
  item: PickerItem;
  documentPageId: DocumentPageId;
  onSelect?: () => void;
}) {
  const content = (
    <>
      <div className="aspect-[4/5] w-full overflow-hidden border border-foreground/20 bg-muted">
        <FakeThumbnail
          kind={item.kind}
          documentPageId={item.kind === "document" ? documentPageId : undefined}
        />
      </div>
      <p className="mt-1.5 truncate text-[10px] leading-tight text-foreground/70">
        {item.name}
      </p>
      <p className="text-[9px] text-foreground/45">
        {item.name.endsWith(".png") ? "PNG · 1,2 MB" : "JPG · 2,4 MB"}
      </p>
    </>
  );

  if (item.selectable && onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="text-left hover:opacity-80"
      >
        {content}
      </button>
    );
  }

  return <div className="opacity-70">{content}</div>;
}

export function ScanDeviceFilePicker({
  onSelectDocument,
  documentPageId = "P1",
}: {
  onSelectDocument: () => void;
  documentPageId?: DocumentPageId;
}) {
  return (
    <div className="flex h-full flex-col bg-muted">
      <div className="shrink-0 border-b bg-background px-4 py-3">
        <p className="text-base font-bold">Zuletzt verwendet</p>
        <p className="text-[10px] text-muted-foreground">
          Bilder und Dateien auf diesem Gerät
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {PICKER_ITEMS.map((item) => (
            <PickerTile
              key={item.id}
              item={item}
              documentPageId={documentPageId}
              onSelect={item.selectable ? onSelectDocument : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
