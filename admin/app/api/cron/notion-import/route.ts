import { NextResponse } from "next/server";
import { importLandingPagesFromNotion } from "@/lib/notion/sync";

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pages = await importLandingPagesFromNotion();
    return NextResponse.json({ imported: pages.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
