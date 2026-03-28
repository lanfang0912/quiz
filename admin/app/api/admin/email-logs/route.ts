import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getEmailLogs } from "@/lib/db/email-logs";
import type { EmailLogStatus } from "@/types";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page   = Number(searchParams.get("page") ?? 1);
  const limit  = Number(searchParams.get("limit") ?? 50);
  const status = (searchParams.get("status") as EmailLogStatus) || undefined;
  const landing_page_id = searchParams.get("landing_page_id") ?? undefined;

  try {
    const result = await getEmailLogs({ page, limit, status, landing_page_id });
    return NextResponse.json({ success: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
