import { NextRequest, NextResponse } from "next/server";
import { getAdminMisconfigReason } from "@/lib/admin-config";
import { SESSION_COOKIE, createSessionToken, passwordMatches } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const misconfig = getAdminMisconfigReason();
  if (misconfig) {
    console.error(`[admin] Login refused: ${misconfig}`);
    return NextResponse.json(
      { error: "Admin login is not configured. Set ADMIN_PASSWORD in the server environment." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !passwordMatches(body.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
