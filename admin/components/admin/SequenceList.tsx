"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Sequence } from "@/lib/db/sequences";

type SlugOption = { value: string; label: string };

export function SequenceList({ sequences: initial, slugOptions }: { sequences: Sequence[]; slugOptions: SlugOption[] }) {
  const router = useRouter();
  const [sequences, setSequences] = useState(initial);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, landing_page_slug: newSlug || null }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSequences((prev) => [json.data, ...prev]);
      setShowNew(false); setNewName(""); setNewSlug("");
    } finally { setSaving(false); }
  }

  async function toggleActive(seq: Sequence) {
    await fetch(`/api/admin/sequences/${seq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !seq.active }),
    });
    setSequences((prev) => prev.map((s) => s.id === seq.id ? { ...s, active: !s.active } : s));
  }

  async function handleDelete(id: string) {
    if (!confirm("確定刪除此序列？所有信件也會一併刪除。")) return;
    await fetch(`/api/admin/sequences/${id}`, { method: "DELETE" });
    setSequences((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
          + 新增序列
        </button>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">新增系列郵件</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">序列名稱 *</label>
              <input required value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="例：關係覺察週報"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">觸發頁面（選填）</label>
              <select value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">所有訂閱者</option>
                {slugOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-gray-600">取消</button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg">
                {saving ? "建立中..." : "建立"}
              </button>
            </div>
          </form>
        </div>
      )}

      {sequences.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-12 text-center text-gray-400 text-sm">
          還沒有序列，點「新增序列」開始
        </div>
      )}

      {sequences.map((seq) => (
        <div key={seq.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{seq.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${seq.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {seq.active ? "啟用" : "停用"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                觸發：{seq.landing_page_slug ? slugOptions.find((o) => o.value === seq.landing_page_slug)?.label ?? seq.landing_page_slug : "所有訂閱者"}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => router.push(`/admin/sequences/${seq.id}`)}
                className="text-sm text-blue-600 hover:underline">編輯信件</button>
              <button onClick={() => toggleActive(seq)}
                className="text-sm text-gray-500 hover:underline">
                {seq.active ? "停用" : "啟用"}
              </button>
              <button onClick={() => handleDelete(seq.id)}
                className="text-sm text-red-500 hover:underline">刪除</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
