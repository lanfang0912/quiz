"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Sequence, SequenceEmail } from "@/lib/db/sequences";

type EmailForm = { day_offset: string; subject: string; body: string };

function emptyForm(): EmailForm { return { day_offset: "0", subject: "", body: "" }; }

export function SequenceDetail({ sequence, initialEmails }: { sequence: Sequence; initialEmails: SequenceEmail[] }) {
  const router = useRouter();
  const [emails, setEmails] = useState(initialEmails);
  const [editing, setEditing] = useState<string | null>(null); // emailId or "new"
  const [form, setForm] = useState<EmailForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit(email: SequenceEmail) {
    setEditing(email.id);
    setForm({ day_offset: String(email.day_offset), subject: email.subject, body: email.body });
  }

  function startNew() { setEditing("new"); setForm(emptyForm()); setError(""); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = { day_offset: Number(form.day_offset), subject: form.subject, body: form.body };
      if (editing === "new") {
        const res = await fetch(`/api/admin/sequences/${sequence.id}/emails`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setEmails((prev) => [...prev, json.data].sort((a, b) => a.day_offset - b.day_offset));
      } else {
        const res = await fetch(`/api/admin/sequences/${sequence.id}/emails/${editing}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setEmails((prev) => prev.map((e) => e.id === editing ? json.data : e).sort((a, b) => a.day_offset - b.day_offset));
      }
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "儲存失敗");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("確定刪除這封信？")) return;
    await fetch(`/api/admin/sequences/${sequence.id}/emails/${id}`, { method: "DELETE" });
    setEmails((prev) => prev.filter((e) => e.id !== id));
  }

  const modal = editing !== null;

  return (
    <div className="space-y-4 max-w-2xl">
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">{editing === "new" ? "新增信件" : "編輯信件"}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                第幾天發送 <span className="text-gray-400 font-normal">（訂閱後第 0 天 = 立即，7 = 第7天）</span>
              </label>
              <input type="number" min="0" required value={form.day_offset}
                onChange={(e) => setForm((p) => ({ ...p, day_offset: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主旨</label>
              <input required value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                placeholder="Email 主旨"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                內文 <span className="text-gray-400 font-normal">（可用 {"{name}"} 插入姓名）</span>
              </label>
              <textarea required value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                rows={14} placeholder={"嗨 {name}，\n\n..."}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600">取消</button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg">
                {saving ? "儲存中..." : "儲存"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/admin/sequences")} className="text-sm text-gray-500 hover:text-gray-700">← 返回列表</button>
        <button onClick={startNew} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">+ 新增信件</button>
      </div>

      {emails.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-12 text-center text-gray-400 text-sm">
          還沒有信件，點「新增信件」開始
        </div>
      )}

      {emails.map((email, i) => (
        <div key={email.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                  第 {email.day_offset} 天
                </span>
                <span className="text-xs text-gray-400">第 {i + 1} 封</span>
              </div>
              <p className="font-medium text-gray-900 text-sm truncate">{email.subject}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{email.body.slice(0, 80)}...</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => startEdit(email)} className="text-sm text-blue-600 hover:underline">編輯</button>
              <button onClick={() => handleDelete(email.id)} className="text-sm text-red-500 hover:underline">刪除</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
