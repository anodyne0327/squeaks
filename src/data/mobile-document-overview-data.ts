import { uploadCenterSections } from "@/data/upload-center-documents";

export type MobileOverviewDocument = {
  id: string;
  label: string;
  badge: "Pflicht" | "Falls vorhanden";
  note?: string;
  files: string[];
};

export type MobileOverviewSection = {
  title: string;
  completionBadge: string;
  sectionLink: string;
  documents: MobileOverviewDocument[];
};

const sectionMeta: Record<
  string,
  { completionBadge: string; sectionLink: string }
> = {
  Antragstellung: {
    completionBadge: "2/3",
    sectionLink: "ANTRAGSTELLER:IN ↗",
  },
  "Pflegebedürftige Person": {
    completionBadge: "2/3",
    sectionLink: "PFLEGEBEDÜRFTIGE PERSON ↗",
  },
  Pflegesituation: {
    completionBadge: "3/5",
    sectionLink: "PFLEGESITUATION ↗",
  },
  Einkünfte: {
    completionBadge: "1/1",
    sectionLink: "EINKÜNFTE ↗",
  },
  "Einkünfte – Partner": {
    completionBadge: "0/1",
    sectionLink: "EINKÜNFTE PARTNER ↗",
  },
  Vermögen: {
    completionBadge: "2/5",
    sectionLink: "VERMÖGEN ↗",
  },
  "Vermögen – Partner": {
    completionBadge: "1/3",
    sectionLink: "VERMÖGEN PARTNER ↗",
  },
  Ausgaben: {
    completionBadge: "2/3",
    sectionLink: "AUSGABEN ↗",
  },
};

const documentMeta: Record<
  string,
  { badge: "Pflicht" | "Falls vorhanden"; note?: string }
> = {
  "antragstellung-personalausweis": { badge: "Pflicht" },
  "antragstellung-schriftliche-vollmacht": {
    badge: "Pflicht",
    note: "möglichst mit Angabe des Vertretungsumfangs gegenüber Behörden und Sozialleistungsträgern",
  },
  "antragstellung-vorsorgevollmacht": { badge: "Falls vorhanden" },
  "pflegebeduerftige-person-personalausweis": { badge: "Pflicht" },
  "pflegebeduerftige-person-namensaenderung": { badge: "Falls vorhanden" },
  "pflegebeduerftige-person-heiratsurkunde": { badge: "Falls vorhanden" },
  "pflegesituation-einstufungsbescheid": { badge: "Pflicht" },
  "pflegesituation-bewilligungsbescheid": { badge: "Pflicht" },
  "pflegesituation-gutachten-md": { badge: "Falls vorhanden" },
  "pflegesituation-leistungsnachweis": { badge: "Pflicht" },
  "pflegesituation-heimvertrag": { badge: "Pflicht" },
  "einkuenfte-rentenbescheid": { badge: "Pflicht" },
  "einkuenfte-partner-rentenbescheid": { badge: "Pflicht" },
  "vermoegen-kassenbelege": { badge: "Falls vorhanden" },
  "vermoegen-kontoauszuege-lueckenlos": { badge: "Pflicht" },
  "vermoegen-kontostand-heimaufnahme": { badge: "Falls vorhanden" },
  "vermoegen-depotauszuege": { badge: "Falls vorhanden" },
  "vermoegen-ertragsabrechnung": { badge: "Falls vorhanden" },
  "vermoegen-partner-kassenbelege": { badge: "Falls vorhanden" },
  "vermoegen-partner-kontoauszuege-lueckenlos": { badge: "Pflicht" },
  "vermoegen-partner-kontostand-heimaufnahme": { badge: "Falls vorhanden" },
  "ausgaben-versicherungskarte": { badge: "Pflicht" },
  "ausgaben-krankenkasse-bestaetigung": { badge: "Pflicht" },
  "ausgaben-pflegeversicherungsnachweis": { badge: "Pflicht" },
};

const documentFilePool: Record<string, string[]> = {
  "antragstellung-personalausweis": ["Personalausweis_Scan.pdf"],
  "antragstellung-schriftliche-vollmacht": [
    "Vollmacht_unterschrieben.pdf",
    "Vollmacht_Anhang_Behörden.pdf",
  ],
  "pflegebeduerftige-person-personalausweis": ["Ausweis_Front_Rückseite.pdf"],
  "pflegebeduerftige-person-heiratsurkunde": ["Heiratsurkunde_1985.pdf"],
  "pflegesituation-bewilligungsbescheid": ["Bewilligung_Pflegekasse_2026.pdf"],
  "pflegesituation-leistungsnachweis": [
    "Leistungsnachweis_Juni_2026.pdf",
    "Leistungsnachweis_Juli_2026.pdf",
  ],
  "pflegesituation-heimvertrag": ["Heimvertrag_Unterschrift.pdf"],
  "einkuenfte-rentenbescheid": ["Rentenbescheid_2026.pdf"],
  "vermoegen-kontoauszuege-lueckenlos": ["Kontoauszüge_Mai-August_2026.pdf"],
  "vermoegen-depotauszuege": [
    "Depotübersicht_Q2_2026.pdf",
    "Depotauszug_Juli_2026.pdf",
  ],
  "vermoegen-partner-kontoauszuege-lueckenlos": [
    "Partner_Kontoauszüge_Juni_2026.pdf",
    "Partner_Kontoauszüge_Juli_2026.pdf",
  ],
  "ausgaben-versicherungskarte": ["Versicherungskarte_2026.pdf"],
  "ausgaben-pflegeversicherungsnachweis": ["Pflegeversicherung_Nachweis.pdf"],
};

function filesForDocument(docId: string, uploadedCount: number): string[] {
  const pool = documentFilePool[docId] ?? [`Dokument_${docId.slice(-8)}.pdf`];
  return pool.slice(0, uploadedCount);
}

export const mobileDocumentOverviewSections: MobileOverviewSection[] =
  uploadCenterSections.map((section) => {
    const meta = sectionMeta[section.title];
    return {
      title: section.title,
      completionBadge: meta.completionBadge,
      sectionLink: meta.sectionLink,
      documents: section.documents.map((doc) => {
        const docMeta = documentMeta[doc.id] ?? { badge: "Pflicht" as const };
        return {
          id: doc.id,
          label: doc.label,
          badge: docMeta.badge,
          note: docMeta.note,
          files: filesForDocument(doc.id, doc.uploadedCount),
        };
      }),
    };
  });
