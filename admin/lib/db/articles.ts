import { supabaseAdmin } from "./client";
import type { Article } from "@/types/article";

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function createArticle(
  payload: Omit<Article, "id" | "created_at" | "updated_at">
): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateArticle(
  id: string,
  payload: Partial<Omit<Article, "id" | "created_at" | "updated_at">>
): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
