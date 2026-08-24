const STORAGE_KEY = "squeaks-prototype-personalausweis-scan-complete";

export const MOBILE_SCAN_PDF_FILENAME =
  "2026_08_24_Personalausweis_oder_Reisepass.pdf";

export function markPersonalausweisScanComplete() {
  localStorage.setItem(STORAGE_KEY, "true");
}

export function isPersonalausweisScanComplete() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function withPersonalausweisScanFile(baseFiles: string[]) {
  if (!isPersonalausweisScanComplete()) return baseFiles;
  if (baseFiles.includes(MOBILE_SCAN_PDF_FILENAME)) return baseFiles;
  return [MOBILE_SCAN_PDF_FILENAME, ...baseFiles];
}

export function initialPersonalausweisUploadCount(baseCount: number) {
  return isPersonalausweisScanComplete() ? baseCount + 1 : baseCount;
}
