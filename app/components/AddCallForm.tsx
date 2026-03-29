"use client";

import { useState } from "react";

export default function AddCallForm() {
  const [isOpen, setIsOpen] = useState(false);

  const [callsName, setCallsName] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [urgency, setUrgency] = useState("中");
  const [summary, setSummary] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/save-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calls_name: callsName,
        caller_phone: callerPhone,
        purpose,
        urgency,
        summary,
        memo,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "受電データの追加に失敗しました");
      setLoading(false);
      return;
    }

    setCallsName("");
    setCallerPhone("");
    setPurpose("");
    setUrgency("中");
    setSummary("");
    setMemo("");
    setLoading(false);
    setIsOpen(false);

    window.location.reload();
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "14px 16px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            受電データ追加
          </div>

          <div
            style={{
              fontSize: 24,
              lineHeight: 1,
              fontWeight: 700,
              color: "#6b7280",
              width: 24,
              textAlign: "center",
            }}
          >
            {isOpen ? "−" : "+"}
          </div>
        </div>
      </button>

      {isOpen ? (
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 12, marginTop: 16 }}
        >
          <input
            type="text"
            placeholder="会社名 / 名前"
            value={callsName}
            onChange={(e) => setCallsName(e.target.value)}
            required
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
            }}
          />

          <input
            type="text"
            placeholder="電話番号"
            value={callerPhone}
            onChange={(e) => setCallerPhone(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
            }}
          />

          <input
            type="text"
            placeholder="用件"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
            }}
          />

          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
            }}
          >
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>

          <textarea
            placeholder="要約"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              resize: "vertical",
            }}
          />

          <textarea
            placeholder="対応メモ（任意）"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "none",
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "追加中..." : "受電データを追加"}
          </button>
        </form>
      ) : null}
    </div>
  );
}