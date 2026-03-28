import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getLandingPageBySlug } from "@/lib/db/landing-pages";
import { LandingPageView } from "@/components/public/LandingPageView";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.seo_title ?? page.name,
    description: page.seo_description ?? undefined,
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page || page.status !== "published") notFound();

  // external 類型 → redirect 到原始頁面
  if (page.page_type === "external" && page.external_url) {
    redirect(page.external_url);
  }

  return <LandingPageView page={page} />;
}
