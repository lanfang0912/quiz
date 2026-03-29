import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getSequenceEmails, createSequenceEmail } from "@/lib/db/sequences";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await getSequenceEmails(id);
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { day_offset, subject, body } = await req.json();
    if (!subject || !body) return NextResponse.json({ success: false, error: "subject 和 body 為必填" }, { status: 400 });
    const data = await createSequenceEmail({ sequence_id: id, day_offset: day_offset ?? 0, subject, body });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}
