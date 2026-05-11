export const RECAPTCHA_V3_ACTION = "contact";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is only available in the browser."));
  }

  if (window.grecaptcha) {
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => resolve());
    });
  }

  const existing = document.querySelector<HTMLScriptElement>(
    'script[src^="https://www.google.com/recaptcha/api.js"]',
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        window.grecaptcha?.ready(() => resolve());
      });
      existing.addEventListener("error", () => {
        reject(new Error("Failed to load reCAPTCHA."));
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha?.ready(() => resolve());
    };
    script.onerror = () => {
      reject(new Error("Failed to load reCAPTCHA."));
    };
    document.head.appendChild(script);
  });
}

export async function executeRecaptchaV3(siteKey: string): Promise<string> {
  await loadRecaptchaScript(siteKey);
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) {
    throw new Error("reCAPTCHA is not available.");
  }

  return grecaptcha.execute(siteKey, { action: RECAPTCHA_V3_ACTION });
}
