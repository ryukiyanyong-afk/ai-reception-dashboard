"use client";

import { useState } from "react";

export default function DeleteCallButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = window.confirm("この受電データをゴミ箱へ移動します。よろしいですか？");
    if (!ok) return;

    setLoading(true);

    const res = await fetch("/api/delete-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "削除に失敗しました");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #dc2626",
        background: "#fff",
        color: "#dc2626",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {loading ? "移動中..." : "ゴミ箱へ移動"}
    </button>
  );
}