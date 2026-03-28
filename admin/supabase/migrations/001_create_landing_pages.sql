-- ─── Landing Pages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landing_pages (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,

  -- 頁面類型
  page_type         text NOT NULL DEFAULT 'hosted'
                      CHECK (page_type IN ('hosted', 'external')),
  external_url      text,
  migration_status  text NOT NULL DEFAULT 'legacy'
                      CHECK (migration_status IN ('legacy', 'transition', 'hosted', 'archived')),
  status            text NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published')),

  -- CTA
  btn               text,
  cta               text,
  keyword           text,
  keyword_reply     text,

  -- Email
  email_subject     text,
  email_body        text,
  confirm_btn       text,

  -- FAQ
  faq_1_q           text,
  faq_1_a           text,
  faq_2_q           text,
  faq_2_a           text,
  faq_3_q           text,
  faq_3_a           text,

  -- Consult Scripts
  consult_1         text,
  consult_2         text,
  consult_3         text,

  -- Hero / SEO
  hero_title        text,
  hero_subtitle     text,
  seo_title         text,
  seo_description   text,

  -- 自由內容（JSON）
  body_json         jsonb,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER landing_pages_updated_at
  BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 索引
CREATE INDEX idx_landing_pages_slug   ON landing_pages (slug);
CREATE INDEX idx_landing_pages_status ON landing_pages (status);
CREATE INDEX idx_landing_pages_type   ON landing_pages (page_type);

-- RLS
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- 公開：只能讀 published 頁面
CREATE POLICY "public_read_published"
  ON landing_pages FOR SELECT
  USING (status = 'published');

-- Service role：完整存取（後台 API 用 service role key）
CREATE POLICY "service_role_all"
  ON landing_pages FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
