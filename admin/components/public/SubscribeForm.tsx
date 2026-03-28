"use client";

import { useState } from "react";

type Props = {
  slug: string;
  btnLabel?: string;
};

type State = "idle" | "loading" | "success" | "error";

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.80)",
  border: "1px solid rgba(176,112,96,.15)",
  borderRadius: 16,
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 24px rgba(176,112,96,.08)",
  padding: "32px 28px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: "1px solid rgba(176,112,96,.25)",
  borderRadius: 10,
  padding: "14px 16px",
  color: "#3d2b1f",
  fontSize: 15,
  fontFamily: "'Noto Sans TC', sans-serif",
  outline: "none",
  transition: "border-color .2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#9a8070",
  marginBottom: 8,
  letterSpacing: ".5px",
};

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
      <div id={`subscribe-form-${slug}`} style={{ ...cardStyle, textAlign: "center", padding: "40px 28px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
        <h3 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 600, color: "#3d2b1f", marginBottom: 12 }}>
          謝謝你！
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "#9a8070" }}>
          清單已經在路上了<br />
          請去信箱（包括垃圾郵件夾）找找看
        </p>
      </div>
    );
  }

  return (
    <form id={`subscribe-form-${slug}`} onSubmit={handleSubmit} style={cardStyle}>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 20, fontWeight: 600, textAlign: "center", color: "#3d2b1f", marginBottom: 8 }}>
        免費領取清單
      </h2>
      <p style={{ fontSize: 13, textAlign: "center", color: "#9a8070", marginBottom: 28, lineHeight: 1.7 }}>
        填入資料，清單會寄到你的信箱
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>你的名字</label>
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          required placeholder="請輸入名字" style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#c9856e")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(176,112,96,.25)")}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Email 信箱</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required placeholder="請輸入有效的 Email" style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#c9856e")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(176,112,96,.25)")}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>電話 <span style={{ color: "#c0a090", fontWeight: 300 }}>（選填）</span></label>
        <input
          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="09xx-xxx-xxx" style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#c9856e")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(176,112,96,.25)")}
        />
      </div>

      {state === "error" && (
        <p style={{ fontSize: 12, color: "#c0503a", marginBottom: 12 }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          width: "100%",
          background: state === "loading" ? "rgba(176,112,96,.5)" : "linear-gradient(135deg,#b07060,#c9856e)",
          border: "none", borderRadius: 12, padding: 16,
          color: "#fff", fontSize: 16, fontWeight: 500,
          fontFamily: "'Noto Sans TC', sans-serif",
          cursor: state === "loading" ? "not-allowed" : "pointer",
          letterSpacing: "0.05em",
          boxShadow: "0 8px 32px rgba(176,112,96,.25)",
          transition: "transform .2s",
        }}
      >
        {state === "loading" ? "送出中⋯" : btnLabel}
      </button>
    </form>
  );
}
