import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/client";
import { resendEmail } from "@/lib/resend";

export async function GET(req: NextRequest) {
  // Vercel Cron 驗證
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 取出所有啟用中的序列
    const { data: sequences } = await supabaseAdmin
      .from("sequences").select("id, landing_page_slug").eq("active", true);
    if (!sequences?.length) return NextResponse.json({ success: true, processed: 0 });

    let sent = 0; let failed = 0;

    for (const seq of sequences) {
      // 取出該序列的所有信件
      const { data: emails } = await supabaseAdmin
        .from("sequence_emails").select("*").eq("sequence_id", seq.id).order("day_offset");
      if (!emails?.length) continue;

      // 取出符合 landing_page_slug 的訂閱者
      let subQuery = supabaseAdmin.from("subscribers").select("id, name, email, created_at");
      if (seq.landing_page_slug) subQuery = subQuery.eq("landing_page_slug", seq.landing_page_slug);
      const { data: subscribers } = await subQuery;
      if (!subscribers?.length) continue;

      for (const sub of subscribers) {
        const daysSince = Math.floor(
          (Date.now() - new Date(sub.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        for (const email of emails) {
          if (email.day_offset !== daysSince) continue;

          // 確認還沒寄過
          const { data: existing } = await supabaseAdmin
            .from("sequence_sends")
            .select("id").eq("subscriber_id", sub.id).eq("sequence_email_id", email.id).single();
          if (existing) continue;

          const interpolate = (str: string) =>
            str.replace(/\{name\}/g, sub.name).replace(/\{email\}/g, sub.email);

          try {
            await resendEmail({
              to: sub.email, name: sub.name,
              subject: interpolate(email.subject),
              body: interpolate(email.body),
            });
            await supabaseAdmin.from("sequence_sends").insert({
              subscriber_id: sub.id, sequence_email_id: email.id,
            });
            sent++;
          } catch {
            failed++;
          }
        }
      }
    }

    return NextResponse.json({ success: true, sent, failed });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}
