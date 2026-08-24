export type UploadDocument = {
  id: string;
  label: string;
  uploadedCount: number;
};

export type UploadSection = {
  title: string;
  documents: UploadDocument[];
};

export const uploadCenterSections: UploadSection[] = [
  {
    title: "Antragstellung",
    documents: [
      {
        id: "antragstellung-personalausweis",
        label: "Personalausweis oder Reisepass",
        uploadedCount: 1,
      },
      {
        id: "antragstellung-schriftliche-vollmacht",
        label: "Schriftliche Vollmacht",
        uploadedCount: 2,
      },
      {
        id: "antragstellung-vorsorgevollmacht",
        label: "Vorsorgevollmacht oder Generalvollmacht",
        uploadedCount: 0,
      },
    ],
  },
  {
    title: "Pflegebedürftige Person",
    documents: [
      {
        id: "pflegebeduerftige-person-personalausweis",
        label: "Personalausweis oder Reisepass",
        uploadedCount: 1,
      },
      {
        id: "pflegebeduerftige-person-namensaenderung",
        label: "Nachweis oder entsprechende Urkunde bei Namensänderung",
        uploadedCount: 0,
      },
      {
        id: "pflegebeduerftige-person-heiratsurkunde",
        label: "Heiratsurkunde",
        uploadedCount: 1,
      },
    ],
  },
  {
    title: "Pflegesituation",
    documents: [
      {
        id: "pflegesituation-einstufungsbescheid",
        label: "Einstufungsbescheid der Pflegekasse für vollstationäre Pflege",
        uploadedCount: 0,
      },
      {
        id: "pflegesituation-bewilligungsbescheid",
        label: "Bewilligungsbescheid der Pflegekasse",
        uploadedCount: 1,
      },
      {
        id: "pflegesituation-gutachten-md",
        label: "Gutachten des MD bzw. Medicproof",
        uploadedCount: 0,
      },
      {
        id: "pflegesituation-leistungsnachweis",
        label: "Leistungsnachweis / Abrechnung der Pflegekasse",
        uploadedCount: 2,
      },
      {
        id: "pflegesituation-heimvertrag",
        label: "Heimvertrag",
        uploadedCount: 1,
      },
    ],
  },
  {
    title: "Einkünfte",
    documents: [
      {
        id: "einkuenfte-rentenbescheid",
        label: "Aktueller Rentenbescheid",
        uploadedCount: 1,
      },
    ],
  },
  {
    title: "Einkünfte – Partner",
    documents: [
      {
        id: "einkuenfte-partner-rentenbescheid",
        label: "Aktueller Rentenbescheid",
        uploadedCount: 0,
      },
    ],
  },
  {
    title: "Vermögen",
    documents: [
      {
        id: "vermoegen-kassenbelege",
        label: "Kassenbelege oder Schließfachnachweis",
        uploadedCount: 0,
      },
      {
        id: "vermoegen-kontoauszuege-lueckenlos",
        label:
          "Lückenlose Kontoauszüge der letzten 3 Monate und des laufenden Monats",
        uploadedCount: 1,
      },
      {
        id: "vermoegen-kontostand-heimaufnahme",
        label: "Kontostandsbescheinigung bei Heimaufnahme",
        uploadedCount: 0,
      },
      {
        id: "vermoegen-depotauszuege",
        label: "Aktuelle Depotauszüge (Gesamtübersicht)",
        uploadedCount: 2,
      },
      {
        id: "vermoegen-ertragsabrechnung",
        label: "Letzte Ertrags- oder Ausschüttungsabrechnung",
        uploadedCount: 0,
      },
    ],
  },
  {
    title: "Vermögen – Partner",
    documents: [
      {
        id: "vermoegen-partner-kassenbelege",
        label: "Kassenbelege oder Schließfachnachweis",
        uploadedCount: 0,
      },
      {
        id: "vermoegen-partner-kontoauszuege-lueckenlos",
        label:
          "Lückenlose Kontoauszüge der letzten 3 Monate und des laufenden Monats",
        uploadedCount: 2,
      },
      {
        id: "vermoegen-partner-kontostand-heimaufnahme",
        label: "Kontostandsbescheinigung bei Heimaufnahme",
        uploadedCount: 0,
      },
    ],
  },
  {
    title: "Ausgaben",
    documents: [
      {
        id: "ausgaben-versicherungskarte",
        label: "Versicherungskarte oder Mitgliedsbescheinigung",
        uploadedCount: 1,
      },
      {
        id: "ausgaben-krankenkasse-bestaetigung",
        label: "Bestätigung der Krankenkasse über Leistungszuständigkeit",
        uploadedCount: 0,
      },
      {
        id: "ausgaben-pflegeversicherungsnachweis",
        label: "Pflegeversicherungsnachweis",
        uploadedCount: 1,
      },
    ],
  },
];

/** Maps desktop requirement keys to Upload Center document IDs */
export const desktopHandoverDocIds: Record<string, string> = {
  personalausweis: "antragstellung-personalausweis",
  kontoauszuege: "vermoegen-kontoauszuege-lueckenlos",
  kontostand: "vermoegen-kontostand-heimaufnahme",
};

export function uploadStatusText(count: number): string {
  if (count === 1) return "1 Datei hochgeladen";
  return `${count} Dateien hochgeladen`;
}
