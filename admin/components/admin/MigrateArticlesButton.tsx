"use client";

import { useState } from "react";

export default function MigrateArticlesButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);

  async function run() {
    setState("loading");
    const res = await fetch("/api/admin/migrate-articles", { method: "POST" });
    const json = await res.json();
    setResult(json);
    setState("done");
  }

  if (state === "done" && result) {
    return (
      <span className="text-sm text-green-600 font-medium">
        ✓ 建立 {result.created} 篇，略過 {result.skipped} 篇（已存在）
      </span>
    );
  }

  return (
    <button
      onClick={run}
      disabled={state === "loading"}
      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700
                 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {state === "loading" ? "匯入中…" : "從 Landing Pages 匯入草稿"}
    </button>
  );
}
