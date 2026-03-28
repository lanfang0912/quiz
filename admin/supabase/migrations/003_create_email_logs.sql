-- ─── Email Logs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id     uuid NOT NULL REFERENCES subscribers (id) ON DELETE CASCADE,
  landing_page_id   uuid REFERENCES landing_pages (id) ON DELETE SET NULL,

  resend_email_id   text,
  subject           text,
  status            text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'sent', 'failed')),
  error_message     text,

  sent_at           timestamptz NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX idx_email_logs_subscriber    ON email_logs (subscriber_id);
CREATE INDEX idx_email_logs_landing_page  ON email_logs (landing_page_id);
CREATE INDEX idx_email_logs_status        ON email_logs (status);
CREATE INDEX idx_email_logs_sent_at       ON email_logs (sent_at DESC);

-- RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Service role：完整存取
CREATE POLICY "service_role_all"
  ON email_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
