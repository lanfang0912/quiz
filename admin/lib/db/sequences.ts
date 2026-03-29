import { supabaseAdmin } from "./client";

export type Sequence = {
  id: string;
  name: string;
  landing_page_slug: string | null;
  active: boolean;
  created_at: string;
};

export type SequenceEmail = {
  id: string;
  sequence_id: string;
  day_offset: number;
  subject: string;
  body: string;
  created_at: string;
};

export async function getSequences(): Promise<Sequence[]> {
  const { data, error } = await supabaseAdmin
    .from("sequences").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSequenceById(id: string): Promise<Sequence | null> {
  const { data, error } = await supabaseAdmin
    .from("sequences").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createSequence(payload: Pick<Sequence, "name" | "landing_page_slug">): Promise<Sequence> {
  const { data, error } = await supabaseAdmin
    .from("sequences").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSequence(id: string, payload: Partial<Sequence>): Promise<Sequence> {
  const { data, error } = await supabaseAdmin
    .from("sequences").update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSequence(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("sequences").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getSequenceEmails(sequenceId: string): Promise<SequenceEmail[]> {
  const { data, error } = await supabaseAdmin
    .from("sequence_emails").select("*").eq("sequence_id", sequenceId).order("day_offset");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createSequenceEmail(payload: Omit<SequenceEmail, "id" | "created_at">): Promise<SequenceEmail> {
  const { data, error } = await supabaseAdmin
    .from("sequence_emails").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSequenceEmail(id: string, payload: Partial<SequenceEmail>): Promise<SequenceEmail> {
  const { data, error } = await supabaseAdmin
    .from("sequence_emails").update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSequenceEmail(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("sequence_emails").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
