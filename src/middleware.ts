import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "gb_admin_session";

function secret() {
  return process.env.ADMIN_PASSWORD || "gulfbreeze";
}

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(sig);
}

async function verify(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = await sign(body);
  if (sig.length !== expected.length) return false;
  let ok = true;
  for (let i = 0; i < sig.length; i++) {
    if (sig[i] !== expected[i]) ok = false;
  }
  if (!ok) return false;
  const [, expStr] = body.split(":");
  const exp = Number(expStr);
  return Number.isFinite(exp) && Date.now() <= exp;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verify(token)) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
