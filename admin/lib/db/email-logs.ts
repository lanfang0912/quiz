import { supabaseAdmin } from "./client";
import type { EmailLog, EmailLogStatus } from "@/types";

export async function createEmailLog(payload: {
  subscriber_id: string;
  landing_page_id?: string | null;
  resend_email_id?: string | null;
  subject?: string | null;
  status: EmailLogStatus;
  error_message?: string | null;
}): Promise<EmailLog> {
  const { data, error } = await supabaseAdmin
    .from("email_logs")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getEmailLogs(options: {
  landing_page_id?: string;
  subscriber_id?: string;
  status?: EmailLogStatus;
  page?: number;
  limit?: number;
} = {}): Promise<{ data: EmailLog[]; count: number }> {
  const { page = 1, limit = 50, ...filters } = options;

  let query = supabaseAdmin
    .from("email_logs")
    .select("*", { count: "exact" });

  if (filters.landing_page_id) query = query.eq("landing_page_id", filters.landing_page_id);
  if (filters.subscriber_id) query = query.eq("subscriber_id", filters.subscriber_id);
  if (filters.status) query = query.eq("status", filters.status);

  const from = (page - 1) * limit;
  query = query.order("sent_at", { ascending: false }).range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data: data ?? [], count: count ?? 0 };
}

export async function getDashboardStats(): Promise<{
  totalPages: number;
  hostedPages: number;
  externalPages: number;
  totalSubscribers: number;
  todaySubscribers: number;
  emailSentCount: number;
  emailFailedCount: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pages, subscribers, todaySubs, sentLogs, failedLogs] = await Promise.all([
    supabaseAdmin.from("landing_pages").select("page_type", { count: "exact" }),
    supabaseAdmin.from("subscribers").select("id", { count: "exact" }),
    supabaseAdmin
      .from("subscribers")
      .select("id", { count: "exact" })
      .gte("created_at", today.toISOString()),
    supabaseAdmin
      .from("email_logs")
      .select("id", { count: "exact" })
      .eq("status", "sent"),
    supabaseAdmin
      .from("email_logs")
      .select("id", { count: "exact" })
      .eq("status", "failed"),
  ]);

  const allPages = pages.data ?? [];
  const hostedCount = allPages.filter((p) => p.page_type === "hosted").length;

  return {
    totalPages: pages.count ?? 0,
    hostedPages: hostedCount,
    externalPages: (pages.count ?? 0) - hostedCount,
    totalSubscribers: subscribers.count ?? 0,
    todaySubscribers: todaySubs.count ?? 0,
    emailSentCount: sentLogs.count ?? 0,
    emailFailedCount: failedLogs.count ?? 0,
  };
}
