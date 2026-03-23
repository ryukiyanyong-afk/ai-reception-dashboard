"use client";

import { useState } from "react";

export default function AddCallForm() {
  const [callsName, setCallsName] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [urgency, setUrgency] = useState("中");
  const [summary, setSummary] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!callsName.trim()) {
      alert("会社名 / 名前を入力してください");
      return;
    }

    if (!callerPhone.trim()) {
      alert("電話番号を入力してください");
      return;
    }

    const phone = callerPhone.replace(/-/g, "").trim();
    if (!/^[0-9]{10,11}$/.test(phone)) {
      alert("電話番号は10桁または11桁の数字で入力してください");
      return;
    }

    if (!purpose.trim()) {
      alert("用件を入力してください");
      return;
    }

    if (!summary.trim()) {
      alert("要約を入力してください");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/save-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calls_name: callsName.trim(),
          caller_phone: phone,
          purpose: purpose.trim(),
          urgency,
          summary: summary.trim(),
          memo: memo.trim(),
          status: "new",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("追加に失敗しました: " + (data.error || "不明なエラー"));
        setLoading(false);
        return;
      }

      alert("受電データを追加しました");
      window.location.reload();
    } catch (error) {
      alert(
        "通信エラーが発生しました: " +
          (error instanceof Error ? error.message : String(error))
      );
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        display: "grid",
        gap: 12,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
        受電データ追加
      </h2>

      <input
        type="text"
        placeholder="会社名 / 名前"
        value={callsName}
        onChange={(e) => setCallsName(e.target.value)}
        disabled={loading}
        style={{
          padding: 10,
          border: "1px solid #d1d5db",
          borderRadius: 8,
        }}
      />

      <input
        type="text"
        placeholder="電話番号"
        value={callerPhone}
        onChange={(e) => setCallerPhone(e.target.value)}
        disabled={loading}
        style={{
          padding: 10,
          border: "1px solid #d1d5db",
          borderRadius: 8,
        }}
      />

      <input
        type="text"
        placeholder="用件"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        disabled={loading}
        style={{
          padding: 10,
          border: "1px solid #d1d5db",
          borderRadius: 8,
        }}
      />

      <select
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
        disabled={loading}
        style={{
          padding: 10,
          border: "1px solid #d1d5db",
          borderRadius: 8,
        }}
      >
        <option value="低">低</option>
        <option value="中">中</option>
        <option value="高">高</option>
      </select>

      <textarea
        placeholder="要約"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={4}
        disabled={loading}
        style={{
          padding: 10,
          border: "1px solid #d1d5db",
          borderRadius: 8,
          resize: "vertical",
        }}
      />

      <textarea
        placeholder="対応メモ（任意）"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows={3}
        disabled={loading}
        style={{
          padding: 10,
          border: "1px solid #d1d5db",
          borderRadius: 8,
          resize: "vertical",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #111827",
          background: loading ? "#6b7280" : "#111827",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 700,
        }}
      >
        {loading ? "送信中..." : "受電データを追加"}
      </button>
    </form>
  );
}