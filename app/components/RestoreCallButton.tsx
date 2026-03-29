"use client";

import { useState } from "react";

export default function RestoreCallButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRestore() {
    const ok = window.confirm("この受電データを通常一覧に戻します。よろしいですか？");
    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/restore-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "復元に失敗しました");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleRestore}
      disabled={loading}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        background: "#fff",
        color: "#111827",
        fontWeight: 600,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {loading ? "復元中..." : "復元"}
    </button>
  );
}