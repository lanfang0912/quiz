# Supabase 設定說明

## 執行順序

在 Supabase 後台 → SQL Editor 依序執行：

```
001_create_landing_pages.sql
002_create_subscribers.sql
003_create_email_logs.sql
004_seed_external_pages.sql   ← 匯入現有 14 個 GitHub Pages
```

## 取得環境變數

Supabase 後台 → Project Settings → API：

```
NEXT_PUBLIC_SUPABASE_URL       → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  → anon / public key
SUPABASE_SERVICE_ROLE_KEY      → service_role key（後台專用，不能外露）
```

## RLS 說明

| 表格            | 公開可讀 | 公開可寫 | 後台（service role） |
|----------------|---------|---------|---------------------|
| landing_pages  | ✅ published only | ❌ | ✅ 完整存取 |
| subscribers    | ❌ | ✅ INSERT only | ✅ 完整存取 |
| email_logs     | ❌ | ❌ | ✅ 完整存取 |

## 注意

- 後台 API 一律使用 `supabaseAdmin`（service role key）
- 前台表單只用 `supabase`（anon key）
- Service role key **絕對不能** 放進 `NEXT_PUBLIC_` 前綴
