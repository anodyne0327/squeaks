import { useState } from "react";
import { Check, ChevronLeft, Smartphone, Upload } from "lucide-react";
import { Link } from "react-router";
import { FileSelectorModal } from "@/components/file-selector-modal";
import { HandoverModal } from "@/components/handover-modal";
import { UploadedFileList } from "@/components/uploaded-file-list";
import { desktopHandoverDocIds } from "@/data/upload-center-documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const versions = ["v1", "v2", "v3"];

function VersionSwitcher({ active }: { active: string }) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border">
      {versions.map((v) => (
        <Link
          key={v}
          to={`/${v}/antrag/nachweise`}
          className={`px-3 py-1 text-xs uppercase ${
            v === active
              ? "bg-foreground text-background"
              : "hover:bg-muted"
          } ${v !== versions[versions.length - 1] ? "border-r" : ""}`}
        >
          {v}
        </Link>
      ))}
    </div>
  );
}

function UploadChoiceTiles({
  onDesktopUpload,
  onSmartphoneHandover,
}: {
  onDesktopUpload: () => void;
  onSmartphoneHandover: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={onDesktopUpload}
        className="flex flex-col items-start gap-1 rounded-md border p-4 text-left hover:bg-muted"
      >
        <Upload className="mb-1 h-5 w-5" />
        <span className="text-sm font-bold">Vom Computer hochladen</span>
        <span className="text-xs text-muted-foreground">
          Datei von diesem Gerät auswählen
        </span>
      </button>
      <button
        onClick={onSmartphoneHandover}
        className="flex flex-col items-start gap-1 rounded-md border p-4 text-left hover:bg-muted"
      >
        <Smartphone className="mb-1 h-5 w-5" />
        <span className="text-sm font-bold">
          Auf dem Handy scannen oder hochladen
        </span>
        <span className="text-xs text-muted-foreground">
          Auf Ihrem Smartphone fortfahren – abfotografieren oder eine
          vorhandene Datei auswählen
        </span>
      </button>
    </div>
  );
}

function RequirementV3({
  title,
  badge,
  badgeVariant,
  note,
  files,
  onDesktopUpload,
  onSmartphoneHandover,
  onDelete,
}: {
  title: string;
  badge: string;
  badgeVariant: "secondary" | "outline";
  note: string;
  files: string[];
  onDesktopUpload: () => void;
  onSmartphoneHandover: () => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Check className="mt-1 h-4 w-4 shrink-0" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{title}</span>
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{note}</p>
        </div>
      </div>

      <UploadChoiceTiles
        onDesktopUpload={onDesktopUpload}
        onSmartphoneHandover={onSmartphoneHandover}
      />

      <UploadedFileList files={files} onDelete={onDelete} />
    </div>
  );
}

const initialFiles: Record<string, string[]> = {
  personalausweis: [
    "Kommunikation 1.png",
    "Figma Invoice Juli 2026.pdf",
    "Aktueller Renten- oder Leistungsbescheid.pdf",
  ],
  kontoauszuege: ["Kontoauszüge_Mai-August_2026.pdf"],
  kontostand: [],
};

export default function AntragNachweiseV3() {
  const [filesByReq, setFilesByReq] =
    useState<Record<string, string[]>>(initialFiles);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [handoverDocId, setHandoverDocId] = useState<string | null>(null);
  const [activeReq, setActiveReq] = useState<string | null>(null);

  const openPicker = (reqId: string) => {
    setActiveReq(reqId);
    setPickerOpen(true);
  };

  const openHandover = (reqId: string) => {
    setHandoverDocId(desktopHandoverDocIds[reqId] ?? null);
    setHandoverOpen(true);
  };

  const addFile = (name: string) => {
    if (!activeReq) return;
    setFilesByReq((prev) => ({
      ...prev,
      [activeReq]: [...prev[activeReq], name],
    }));
  };

  const deleteFile = (reqId: string, index: number) => {
    setFilesByReq((prev) => ({
      ...prev,
      [reqId]: prev[reqId].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <header className="border-b px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">formfix</span>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to start
              </Link>
              <VersionSwitcher active="v3" />
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <span className="text-muted-foreground">Erste Fragen</span>
              <span className="text-muted-foreground">Dokumente</span>
              <span className="font-bold underline underline-offset-8">
                Antrag
              </span>
            </nav>
          </div>

          <div className="flex w-72 flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span>Erste Fragen</span>
              <span className="font-bold">Antrag</span>
              <span className="text-muted-foreground">39%</span>
            </div>
            <Progress value={39} />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>12/12 Abschnitte</span>
              <span>0/13 Abschnitte</span>
            </div>
          </div>
        </div>
      </header>

      {/* Section header */}
      <div className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button className="flex items-center gap-1 text-sm hover:underline">
            <ChevronLeft className="h-4 w-4" />
            Zur Übersicht
          </button>
          <span className="text-sm text-muted-foreground">
            Vorheriger Abschnitt
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Überspringen
            </Button>
            <Button size="sm">Weiter</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Erforderliche Nachweise</CardTitle>
              <p className="text-sm text-muted-foreground">
                Das Sozialamt benötigt folgende Unterlagen zur Prüfung Ihrer
                Angaben.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="font-bold">
                  Personalausweis oder Reisepass
                </span>
                <Badge variant="secondary">Pflicht</Badge>
              </div>

              <UploadChoiceTiles
                onDesktopUpload={() => openPicker("personalausweis")}
                onSmartphoneHandover={() => openHandover("personalausweis")}
              />

              <UploadedFileList
                files={filesByReq.personalausweis}
                onDelete={(index) => deleteFile("personalausweis", index)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Erforderliche Nachweise</CardTitle>
              <p className="text-sm text-muted-foreground">
                Das Sozialamt benötigt folgende Unterlagen zur Prüfung Ihrer
                Angaben.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <RequirementV3
                title="Lückenlose Kontoauszüge der letzten 3 Monate und des laufenden Monats"
                badge="Pflicht"
                badgeVariant="secondary"
                note="Regional teils 6 Monate erforderlich."
                files={filesByReq.kontoauszuege}
                onDesktopUpload={() => openPicker("kontoauszuege")}
                onSmartphoneHandover={() => openHandover("kontoauszuege")}
                onDelete={(index) => deleteFile("kontoauszuege", index)}
              />
              <Separator />
              <RequirementV3
                title="Kontostandsbescheinigung bei Heimaufnahme"
                badge="Falls vorhanden"
                badgeVariant="outline"
                note="Nur falls keine Auszüge vorhanden."
                files={filesByReq.kontostand}
                onDesktopUpload={() => openPicker("kontostand")}
                onSmartphoneHandover={() => openHandover("kontostand")}
                onDelete={(index) => deleteFile("kontostand", index)}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <FileSelectorModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onConfirm={addFile}
      />
      <HandoverModal
        open={handoverOpen}
        onOpenChange={setHandoverOpen}
        highlightDocId={handoverDocId}
      />
    </div>
  );
}
