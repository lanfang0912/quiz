-- ─── Subscribers ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id     uuid REFERENCES landing_pages (id) ON DELETE SET NULL,
  landing_page_slug   text,

  -- 基本資料
  name                text NOT NULL,
  email               text NOT NULL,
  phone               text,
  line_id             text,

  -- 來源追蹤
  source              text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,

  -- 管理用
  tag                 text,
  note                text,

  -- Email 狀態
  email_sent          boolean NOT NULL DEFAULT false,
  email_sent_at       timestamptz,

  -- Notion 同步
  notion_synced       boolean NOT NULL DEFAULT false,

  created_at          timestamptz NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX idx_subscribers_email          ON subscribers (email);
CREATE INDEX idx_subscribers_landing_page   ON subscribers (landing_page_id);
CREATE INDEX idx_subscribers_slug           ON subscribers (landing_page_slug);
CREATE INDEX idx_subscribers_created_at     ON subscribers (created_at DESC);
CREATE INDEX idx_subscribers_email_sent     ON subscribers (email_sent);

-- RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 公開：只能 INSERT（訂閱表單）
CREATE POLICY "public_insert"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- Service role：完整存取
CREATE POLICY "service_role_all"
  ON subscribers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
