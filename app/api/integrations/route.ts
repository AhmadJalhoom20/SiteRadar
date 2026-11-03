import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { getSecret, saveSecret } from "@/server/secrets";
import { isLocalRequest } from "@/server/request-policy";
export async function GET() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  return NextResponse.json({
    data: {
      serpapi: !!getSecret(user.id, "serpapi"),
      browser: true,
      plan: "free",
      unlimited: true,
    },
  });
}
export async function POST(req: NextRequest) {
  if (!isLocalRequest(req, true))
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  try {
    const body = await req.json();
    if (
      body.provider !== "serpapi" ||
      typeof body.key !== "string" ||
      body.key.length > 512
    )
      throw new Error();
    saveSecret(user.id, "serpapi", body.key.trim());
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save the provider key." },
      { status: 400 },
    );
  }
}
