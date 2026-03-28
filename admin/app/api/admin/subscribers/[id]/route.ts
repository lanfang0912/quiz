import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { deleteSubscriber } from "@/lib/db/subscribers";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await deleteSubscriber(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
