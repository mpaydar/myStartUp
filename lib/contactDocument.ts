export const MAX_CONTACT_FILE_BYTES = 15 * 1024 * 1024;

const ALLOWED_EXT = new Set([
  "pdf",
  "doc",
  "docx",
  "txt",
  "png",
  "jpg",
  "jpeg",
  "webp",
]);

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export function isAllowedContactFileName(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return Boolean(ext && ALLOWED_EXT.has(ext));
}

export function isAllowedContactContentType(
  contentType: string | null | undefined,
  fileName: string,
): boolean {
  const type = contentType?.trim() ?? "";
  if (type && ALLOWED_TYPES.has(type)) return true;
  if (!type || type === "application/octet-stream") {
    return isAllowedContactFileName(fileName);
  }
  return false;
}

export function isAllowedContactFileMeta(options: {
  fileName: string;
  fileSize: number;
  contentType: string | null | undefined;
}): boolean {
  if (!options.fileName.trim()) return false;
  if (options.fileSize <= 0 || options.fileSize > MAX_CONTACT_FILE_BYTES) {
    return false;
  }
  return isAllowedContactContentType(options.contentType, options.fileName);
}
