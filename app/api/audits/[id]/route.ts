import { NextRequest, NextResponse } from "next/server";
import { getAudit, saveAudit } from "@/server/db";
import { isLocalRequest } from "@/server/request-policy";
import { currentUser } from "@/server/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isLocalRequest(req))
    return NextResponse.json(
      { error: "Local workspace access only." },
      { status: 403 },
    );
  const a = getAudit((await params).id);
  const user = await currentUser();
  if (!user)
    return NextResponse.json(
      { error: "Sign in to view this report." },
      { status: 401 },
    );
  if (a && a.ownerId !== user.id)
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  return a
    ? NextResponse.json({ data: a })
    : NextResponse.json({ error: "Scan not found." }, { status: 404 });
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isLocalRequest(req, true))
    return NextResponse.json(
      { error: "Cross-origin writes are not allowed." },
      { status: 403 },
    );
  const a = getAudit((await params).id);
  const user = await currentUser();
  if (!user)
    return NextResponse.json(
      { error: "Sign in to manage this scan." },
      { status: 401 },
    );
  if (a && a.ownerId !== user.id)
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  if (!a)
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  if (a.status === "queued" || a.status === "running") {
    a.status = "cancelled";
    a.events.push({
      time: new Date().toISOString(),
      message: "Cancellation requested.",
    });
    saveAudit(a);
  }
  return NextResponse.json({ data: a });
}
