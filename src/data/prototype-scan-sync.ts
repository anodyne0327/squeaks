const SCAN_COMPLETE_KEY = "squeaks-prototype-personalausweis-scan-complete";
const PDF_UPLOADS_KEY = "squeaks-prototype-pdf-uploads";

export const MOBILE_SCAN_PDF_FILENAME =
  "2026_08_24_Personalausweis_oder_Reisepass.pdf";

export const MOBILE_TO_DESKTOP_REQ: Record<string, string> = {
  "antragstellung-personalausweis": "personalausweis",
  "vermoegen-kontoauszuege-lueckenlos": "kontoauszuege",
  "vermoegen-kontostand-heimaufnahme": "kontostand",
};

export type PdfUploadRecord = {
  docId: string;
  filename: string;
};

export function markPersonalausweisScanComplete() {
  localStorage.setItem(SCAN_COMPLETE_KEY, "true");
}

export function isPersonalausweisScanComplete() {
  return localStorage.getItem(SCAN_COMPLETE_KEY) === "true";
}

export function getPdfUploads(): PdfUploadRecord[] {
  try {
    const raw = localStorage.getItem(PDF_UPLOADS_KEY);
    return raw ? (JSON.parse(raw) as PdfUploadRecord[]) : [];
  } catch {
    return [];
  }
}

export function markPdfUploaded(docId: string, filename: string) {
  const uploads = getPdfUploads();
  localStorage.setItem(
    PDF_UPLOADS_KEY,
    JSON.stringify([...uploads, { docId, filename }]),
  );
}

export function getPdfUploadCount(docId: string) {
  return getPdfUploads().filter((upload) => upload.docId === docId).length;
}

export function initialMobileUploadCount(docId: string, baseCount: number) {
  let count = baseCount + getPdfUploadCount(docId);
  if (docId === "antragstellung-personalausweis" && isPersonalausweisScanComplete()) {
    count += 1;
  }
  return count;
}

export function withDesktopFiles(reqId: string, baseFiles: string[]) {
  let files = [...baseFiles];

  if (reqId === "personalausweis") {
    if (
      isPersonalausweisScanComplete() &&
      !files.includes(MOBILE_SCAN_PDF_FILENAME)
    ) {
      files = [MOBILE_SCAN_PDF_FILENAME, ...files];
    }
  }

  const pdfFilenames = getPdfUploads()
    .filter((upload) => MOBILE_TO_DESKTOP_REQ[upload.docId] === reqId)
    .map((upload) => upload.filename);

  for (const filename of [...pdfFilenames].reverse()) {
    if (!files.includes(filename)) {
      files.unshift(filename);
    }
  }

  return files;
}

/** @deprecated Use withDesktopFiles */
export function withPersonalausweisScanFile(baseFiles: string[]) {
  return withDesktopFiles("personalausweis", baseFiles);
}

/** @deprecated Use initialMobileUploadCount */
export function initialPersonalausweisUploadCount(baseCount: number) {
  return initialMobileUploadCount("antragstellung-personalausweis", baseCount);
}
