/** Placeholder value in .env.example — must not be used in production. */
export const ADMIN_PASSWORD_PLACEHOLDER = "change-me";

function trimEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function isPlaceholder(value: string): boolean {
  return value === ADMIN_PASSWORD_PLACEHOLDER;
}

export type AdminConfig =
  | { ok: true; password: string; sessionSecret: string }
  | { ok: false; reason: string };

export function getAdminConfig(): AdminConfig {
  const password = trimEnv("ADMIN_PASSWORD");
  if (!password) {
    return { ok: false, reason: "ADMIN_PASSWORD is missing or empty" };
  }

  const sessionSecret = trimEnv("ADMIN_SESSION_SECRET") ?? password;

  if (isProduction()) {
    if (isPlaceholder(password)) {
      return {
        ok: false,
        reason:
          "ADMIN_PASSWORD must be set to a real value in production (not the .env.example placeholder)",
      };
    }
    if (isPlaceholder(sessionSecret)) {
      return {
        ok: false,
        reason: "ADMIN_SESSION_SECRET must not be the .env.example placeholder in production",
      };
    }
  }

  return { ok: true, password, sessionSecret };
}

/** When set, admin login and session verification should be disabled. */
export function getAdminMisconfigReason(): string | null {
  const cfg = getAdminConfig();
  return cfg.ok ? null : cfg.reason;
}

export function getAdminPassword(): string | undefined {
  const cfg = getAdminConfig();
  return cfg.ok ? cfg.password : undefined;
}

export function getSessionSecret(): string | undefined {
  const cfg = getAdminConfig();
  return cfg.ok ? cfg.sessionSecret : undefined;
}
