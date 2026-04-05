import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/db/client";
import { createArticle } from "@/lib/db/articles";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pages, error } = await supabaseAdmin
    .from("landing_pages")
    .select("slug, name, hero_title, hero_subtitle, email_body, seo_title, seo_description")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let created = 0;
  let skipped = 0;

  for (const page of pages ?? []) {
    const { data: existing } = await supabaseAdmin
      .from("articles")
      .select("id")
      .eq("slug", page.slug)
      .maybeSingle();

    if (existing) { skipped++; continue; }

    await createArticle({
      title:             page.hero_title ?? page.name,
      slug:              page.slug,
      excerpt:           page.hero_subtitle,
      content:           page.email_body,
      status:            "draft",
      landing_page_slug: page.slug,
      seo_title:         page.seo_title,
      seo_description:   page.seo_description,
      cover_image:       null,
      summary_image:     null,
      published_at:      null,
    });
    created++;
  }

  return NextResponse.json({ created, skipped });
}
