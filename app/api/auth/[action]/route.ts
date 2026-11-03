import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import {configuredSiteUrl} from '@/lib/site';
import { hashPassword, verifyPassword } from "@/server/passwords";
import {
  allowAuthAttempt,
  createSession,
  SESSION_COOKIE,
  tokenHash,
} from "@/server/auth";
import { isLocalRequest } from "@/server/request-policy";
const input = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z
    .email()
    .max(254)
    .transform((x) => x.toLowerCase()),
  password: z.string().min(10).max(128),
  importReports: z.boolean().optional(),
});
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!isLocalRequest(req, true))
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  const { action } = await params;
  if (action === "sign-out") {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (token)
      db.prepare("DELETE FROM sessions WHERE token_hash=?").run(
        tokenHash(token),
      );
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  }
  if (!["sign-in", "sign-up"].includes(action))
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    const raw = await req.text();
    if (raw.length > 4096) throw new Error("Form is too large.");
    const parsed = input.safeParse(JSON.parse(raw));
    if (!parsed.success)
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.path.includes("password")
            ? "Use a password with 10–128 characters."
            : "Enter a valid name, email, and password.",
        },
        { status: 400 },
      );
    const values = parsed.data;
    if (!allowAuthAttempt(tokenHash(values.email)))
      return NextResponse.json(
        {
          error: "Too many attempts for this account. Try again in 15 minutes.",
        },
        { status: 429 },
      );
    let user = db
      .prepare("SELECT * FROM users WHERE email=?")
      .get(values.email);
    if (action === "sign-up") {
      if (user)
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. Sign in instead.",
          },
          { status: 409 },
        );
      if (!values.name)
        return NextResponse.json(
          { error: "Enter your name." },
          { status: 400 },
        );
      const id = crypto.randomUUID();
      const hash = await hashPassword(values.password);
      db.prepare("INSERT INTO users VALUES(?,?,?,?,?)").run(
        id,
        values.email,
        values.name,
        hash,
        new Date().toISOString(),
      );
      user = { id, email: values.email, name: values.name };
    } else if (
      !user ||
      !(await verifyPassword(values.password, String(user.password_hash)))
    )
      return NextResponse.json(
        { error: "Email or password is incorrect." },
        { status: 401 },
      );
    db.prepare("DELETE FROM auth_attempts WHERE ip=?").run(
      tokenHash(values.email),
    );
    const token = createSession(String(user.id));
    const res = NextResponse.json({
      data: { id: user.id, name: user.name, email: user.email },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86400,
      secure: configuredSiteUrl().public||req.nextUrl.protocol === "https:",
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Could not finish. Please try again." },
      { status: 400 },
    );
  }
}
