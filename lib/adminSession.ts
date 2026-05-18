const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = (4 - (s.length % 4)) % 4;
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

async function hmacSha256Raw(secret: string, message: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return new Uint8Array(sig);
}

export async function createAdminSessionToken(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const payloadStr = JSON.stringify({ v: 1 as const, exp });
  const sig = await hmacSha256Raw(secret, payloadStr);
  const payloadB64 = bytesToBase64Url(new TextEncoder().encode(payloadStr));
  const sigB64 = bytesToBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminSessionToken(
  secret: string,
  token: string,
): Promise<boolean> {
  if (!secret || !token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!payloadB64 || !sigB64) return false;
  try {
    const payloadStr = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    const expectedSig = await hmacSha256Raw(secret, payloadStr);
    const actualSig = base64UrlToBytes(sigB64);
    if (!timingSafeEqual(expectedSig, actualSig)) return false;
    const payload = JSON.parse(payloadStr) as { v?: number; exp?: number };
    if (payload.v !== 1 || typeof payload.exp !== "number") return false;
    if (payload.exp <= Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = "admin_session";
