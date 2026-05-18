/** Minimum length for ADMIN_SESSION_SECRET (signing key). */
export const ADMIN_SESSION_SECRET_MIN_LEN = 24;

function pickEnv(...keys: string[]): string {
  for (const key of keys) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return "";
}

export function getAdminAuthCredentials():
  | { password: string; secret: string }
  | null {
  const password = pickEnv("ADMIN_PASSWORD", "admin_password");
  const secret = pickEnv("ADMIN_SESSION_SECRET", "admin_session_secret");
  if (!password || !secret || secret.length < ADMIN_SESSION_SECRET_MIN_LEN) {
    return null;
  }
  return { password, secret };
}

export function isAdminAuthConfigured(): boolean {
  return getAdminAuthCredentials() !== null;
}

/** Dev-only diagnostics (no secret values). */
export function adminAuthEnvDiagnostics(): {
  passwordSet: boolean;
  secretLength: number;
  secretLongEnough: boolean;
} {
  const password = pickEnv("ADMIN_PASSWORD", "admin_password");
  const secret = pickEnv("ADMIN_SESSION_SECRET", "admin_session_secret");
  return {
    passwordSet: password.length > 0,
    secretLength: secret.length,
    secretLongEnough: secret.length >= ADMIN_SESSION_SECRET_MIN_LEN,
  };
}
