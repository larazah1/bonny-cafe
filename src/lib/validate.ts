/**
 * Lightweight input validation/sanitization helpers.
 *
 * Note on scope: this app has no database or server — everything lives in
 * the browser's localStorage — so classic SQL injection has no attack
 * surface here (there's no SQL anywhere in the codebase). React also
 * escapes all rendered text by default and this codebase never uses
 * dangerouslySetInnerHTML, so reflected/stored XSS via product names,
 * notes, etc. isn't reachable either. What *is* worth guarding, and what
 * these helpers cover: keeping user-entered data well-formed, and making
 * sure admin-entered image paths can't carry an executable URI scheme
 * (javascript:, vbscript:, arbitrary data: types) into a src attribute —
 * only same-origin app paths, https URLs, and data:image/* (the format
 * browser-side image uploads produce) are allowed through.
 */

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Accepts digits, spaces, +, -, ( ) — loose on purpose since we support
 * multiple phone formats, strict on rejecting anything that isn't a phone
 * number shape. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  return /^\+?[0-9\s\-()]{7,20}$/.test(trimmed);
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Restrict admin-entered image references to same-origin app paths, plain
 * https URLs, or data:image/* (uploaded-file previews) — never
 * javascript:/vbscript:/data:text/html or similar. */
export function sanitizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(trimmed)) return trimmed;
  return "";
}

export function clamp(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}
