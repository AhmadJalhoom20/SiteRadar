import { NextRequest, NextResponse } from "next/server";
import { auditInput } from "@/server/contracts";
import { listAudits, saveAudit, saveProject } from "@/server/db";
import { currentUser } from "@/server/auth";
import { validateTarget } from "@/server/safe-fetch";
import type { Audit } from "@/lib/types";
import { isLocalRequest } from "@/server/request-policy";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  if (!isLocalRequest(req))
    return NextResponse.json(
      { error: "Local workspace access only." },
      { status: 403 },
    );
  const user = await currentUser();
  if (!user)
    return NextResponse.json(
      { error: "Sign in to view your projects." },
      { status: 401 },
    );
  return NextResponse.json({ data: listAudits(user.id) });
}
export async function POST(req: NextRequest) {
  if (!isLocalRequest(req, true))
    return NextResponse.json(
      { error: "Cross-origin writes are not allowed." },
      { status: 403 },
    );
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json(
        { error: "Sign in to start an audit." },
        { status: 401 },
      );
    const raw = await req.text();
    if (raw.length > 64_000)
      return NextResponse.json(
        { error: "Scan configuration exceeds the size limit." },
        { status: 413 },
      );
    const parsed=auditInput.safeParse(JSON.parse(raw));
    if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message??'Check the scan configuration.'},{status:400});
    const input = parsed.data;
    validateTarget(input.url);
    const projectId = saveProject(user.id, input);
    const active = listAudits(user.id).find(
      (a) =>
        a.projectId === projectId && ["running", "queued"].includes(a.status),
    );
    if (active) return NextResponse.json({ data: active });
    const a: Audit = {
      id: crypto.randomUUID(),
      ownerId: user.id,
      projectId,
      name: new URL(input.url).hostname,
      url: input.url,
      config: input,
      status: "queued",
      createdAt: new Date().toISOString(),
      score: null,
      scores: [],
      pages: [],
      findings: [],
      events: [
        {
          time: new Date().toISOString(),
          message: "Scan queued. Waiting for the Node.js worker.",
        },
      ],
    };
    saveAudit(a);
    return NextResponse.json({ data: a }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid scan configuration." },
      { status: 400 },
    );
  }
}
