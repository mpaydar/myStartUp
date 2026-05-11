const SITE_KEY_ENV_NAMES = [
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
  "RECAPTCHA_SITE_KEY",
  "ReCaptcha_sitekey",
] as const;

const SECRET_KEY_ENV_NAMES = [
  "RECAPTCHA_SECRET_KEY",
  "ReCaptcha_secretKey",
  "recaptcha_secret_key",
] as const;

function readEnv(names: readonly string[]): string | null {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return null;
}

export function getRecaptchaSiteKey(): string | null {
  return readEnv(SITE_KEY_ENV_NAMES);
}

export function getRecaptchaSecretKey(): string | null {
  return readEnv(SECRET_KEY_ENV_NAMES);
}

export function isRecaptchaConfigured(): boolean {
  return Boolean(getRecaptchaSiteKey() && getRecaptchaSecretKey());
}

export const RECAPTCHA_V3_ACTION = "contact";

const DEFAULT_RECAPTCHA_MIN_SCORE = 0.5;

type SiteVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

function getRecaptchaMinScore(): number {
  const raw = process.env.RECAPTCHA_MIN_SCORE?.trim();
  if (!raw) return DEFAULT_RECAPTCHA_MIN_SCORE;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return DEFAULT_RECAPTCHA_MIN_SCORE;
  }
  return parsed;
}

export async function verifyRecaptchaToken(
  token: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = getRecaptchaSecretKey();
  if (!secret) {
    return { ok: false, error: "reCAPTCHA is not configured on the server." };
  }

  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, error: "Please complete the reCAPTCHA verification." };
  }

  let response: Response;
  try {
    response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: trimmed,
      }),
    });
  } catch (err) {
    console.error("reCAPTCHA verification request failed:", err);
    return {
      ok: false,
      error: "Could not verify reCAPTCHA. Please try again.",
    };
  }

  let data: SiteVerifyResponse;
  try {
    data = (await response.json()) as SiteVerifyResponse;
  } catch (err) {
    console.error("reCAPTCHA verification response parse failed:", err);
    return {
      ok: false,
      error: "Could not verify reCAPTCHA. Please try again.",
    };
  }

  if (!data.success) {
    console.error("reCAPTCHA verification rejected:", data["error-codes"]);
    return {
      ok: false,
      error: "reCAPTCHA verification failed. Please try again.",
    };
  }

  if (data.action && data.action !== RECAPTCHA_V3_ACTION) {
    console.error("reCAPTCHA action mismatch:", data.action);
    return {
      ok: false,
      error: "reCAPTCHA verification failed. Please try again.",
    };
  }

  if (typeof data.score === "number" && data.score < getRecaptchaMinScore()) {
    console.error("reCAPTCHA score below threshold:", data.score);
    return {
      ok: false,
      error: "reCAPTCHA verification failed. Please try again.",
    };
  }

  return { ok: true };
}
