"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ImportFromNotionButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  async function handleImport() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/notion/import-landing-pages", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.imported === 0 ? "Notion 沒有新草稿" : `已匯入 ${data.imported} 筆`);
      if (data.imported > 0) router.refresh();
    } catch (err) {
      setResult(err instanceof Error ? err.message : "匯入失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleImport}
        disabled={loading}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium
                   px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "匯入中…" : "從 Notion 匯入"}
      </button>
      {result && (
        <span className="text-sm text-gray-500">{result}</span>
      )}
    </div>
  );
}
