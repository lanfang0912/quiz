import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import {
  getLandingPageById,
  updateLandingPage,
  deleteLandingPage,
  duplicateLandingPage,
} from "@/lib/db/landing-pages";

function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { id } = await params;
  const page = await getLandingPageById(id);
  if (!page) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: page });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    const body = await req.json();

    // 特殊動作：duplicate / publish / unpublish
    if (body._action === "duplicate") {
      const copy = await duplicateLandingPage(id);
      return NextResponse.json({ success: true, data: copy });
    }
    if (body._action === "publish") {
      const page = await updateLandingPage(id, { status: "published" });
      return NextResponse.json({ success: true, data: page });
    }
    if (body._action === "unpublish") {
      const page = await updateLandingPage(id, { status: "draft" });
      return NextResponse.json({ success: true, data: page });
    }

    const page = await updateLandingPage(id, body);
    return NextResponse.json({ success: true, data: page });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    await deleteLandingPage(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
