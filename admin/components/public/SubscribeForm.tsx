"use client";

import { useState } from "react";

type Props = {
  slug: string;
  btnLabel?: string;
};

type State = "idle" | "loading" | "success" | "error";

export function SubscribeForm({ slug, btnLabel = "立即領取" }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, phone: phone || undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "訂閱失敗");
      setState("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "發生錯誤，請稍後再試");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        id={`subscribe-form-${slug}`}
        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
      >
        <div className="text-3xl mb-3">✓</div>
        <h3 className="font-bold text-green-800 text-lg mb-1">成功送出！</h3>
        <p className="text-green-700 text-sm">請查收你的 Email，資料即將送達。</p>
      </div>
    );
  }

  return (
    <form
      id={`subscribe-form-${slug}`}
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="你的名字"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          電話 <span className="text-gray-400 font-normal">（選填）</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xx-xxx-xxx"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                   text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        {state === "loading" ? "送出中..." : btnLabel}
      </button>
    </form>
  );
}
