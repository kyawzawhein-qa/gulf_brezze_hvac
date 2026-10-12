import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAdminPassword, getSessionSecret } from "./admin-config";

export const SESSION_COOKIE = "gb_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sign(payload: string) {
  const key = getSessionSecret();
  if (!key) {
    throw new Error("Admin session signing is not configured");
  }
  return createHmac("sha256", key).update(payload).digest("hex");
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_TTL_MS;
  const body = `ok:${exp}`;
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !getSessionSecret()) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return false;
  }
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const [, expStr] = body.split(":");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export function passwordMatches(input: string) {
  const expected = getAdminPassword();
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // still do a compare to reduce trivial timing leaks on length
    timingSafeEqual(Buffer.alloc(b.length), b);
    return false;
  }
  return timingSafeEqual(a, b);
}
