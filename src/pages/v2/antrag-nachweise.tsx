import {
  Check,
  ChevronLeft,
  Download,
  Smartphone,
  Trash2,
  Upload,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const uploadedFiles = [
  "Kommunikation 1.png",
  "Figma Invoice Juli 2026.pdf",
  "Aktueller Renten- oder Leistungsbescheid.pdf",
];

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

function RequirementV2({
  title,
  badge,
  badgeVariant,
  note,
  files = [],
}: {
  title: string;
  badge: string;
  badgeVariant: "secondary" | "outline";
  note: string;
  files?: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
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

        {/* Joined button: desktop upload OR mobile scan */}
        <div className="inline-flex shrink-0 overflow-hidden rounded-md border">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-muted">
            <Upload className="h-4 w-4" />
            Datei hochladen
          </button>
          <span className="w-px bg-border" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-muted">
            <Smartphone className="h-4 w-4" />
            Mit Handy scannen
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="divide-y">
          {files.map((file) => (
            <div
              key={file}
              className="flex items-center justify-between gap-4 py-2"
            >
              <span className="text-sm underline underline-offset-2">
                {file}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-foreground">
                  <Download className="h-4 w-4" />
                  Herunterladen
                </button>
                <button className="flex items-center gap-1 hover:text-foreground">
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AntragNachweiseV2() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <header className="border-b px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">formfix</span>
            <VersionSwitcher active="v2" />
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="font-bold">
                    Personalausweis oder Reisepass
                  </span>
                  <Badge variant="secondary">Pflicht</Badge>
                </div>

                {/* Joined button: desktop upload OR mobile scan */}
                <div className="inline-flex overflow-hidden rounded-md border">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    Datei hochladen
                  </button>
                  <span className="w-px bg-border" />
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-muted">
                    <Smartphone className="h-4 w-4" />
                    Mit Handy scannen
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {uploadedFiles.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between gap-4 py-2"
                  >
                    <span className="text-sm underline underline-offset-2">
                      {file}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <Download className="h-4 w-4" />
                        Herunterladen
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <Trash2 className="h-4 w-4" />
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
            <CardContent className="space-y-4">
              <RequirementV2
                title="Lückenlose Kontoauszüge der letzten 3 Monate und des laufenden Monats"
                badge="Pflicht"
                badgeVariant="secondary"
                note="Regional teils 6 Monate erforderlich."
                files={["Kontoauszüge_Mai-August_2026.pdf"]}
              />
              <Separator />
              <RequirementV2
                title="Kontostandsbescheinigung bei Heimaufnahme"
                badge="Falls vorhanden"
                badgeVariant="outline"
                note="Nur falls keine Auszüge vorhanden."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
