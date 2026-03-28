import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLandingPageBySlug } from "@/lib/db/landing-pages";
import { getTheme } from "@/lib/themes";
import { QuizView } from "@/components/public/QuizView";

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

export default async function CheckPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page || page.status !== "published" || !page.body_json) notFound();

  const theme = getTheme(page.theme);

  return <QuizView page={page} theme={theme} />;
}
