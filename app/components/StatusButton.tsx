"use client";

import { useState } from "react";

type Props = {
  id: string;
  initialStatus: string | null;
};

const statusMap: Record<string, string> = {
  new: "未対応",
  in_progress: "対応中",
  done: "完了",
};

const nextStatusMap: Record<string, string> = {
  new: "in_progress",
  in_progress: "done",
  done: "new",
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  new: {
    bg: "#fef3c7",
    text: "#92400e",
    border: "#f59e0b",
  },
  in_progress: {
    bg: "#dbeafe",
    text: "#1d4ed8",
    border: "#3b82f6",
  },
  done: {
    bg: "#dcfce7",
    text: "#166534",
    border: "#22c55e",
  },
};

export default function StatusButton({ id, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus || "new");
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    if (loading) return;

    const nextStatus = nextStatusMap[status] || "new";
    setLoading(true);

    try {
      const res = await fetch("/api/status-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("ステータス更新に失敗しました: " + data.error);
        setLoading(false);
        return;
      }

      setStatus(nextStatus);
      window.location.reload();
    } catch (error) {
  alert(
    "通信エラーが発生しました: " +
      (error instanceof Error ? error.message : String(error))
  );
}
    setLoading(false);
  };

  const colors = colorMap[status] || colorMap.new;

  return (
    <button
      onClick={updateStatus}
      disabled={loading}
      style={{
        marginTop: 8,
        padding: "10px 14px",
        borderRadius: 9999,
        border: `1px solid ${colors.border}`,
        background: loading ? "#e5e7eb" : colors.bg,
        color: loading ? "#666" : colors.text,
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 700,
        fontSize: 14,
      }}
      title="クリックでステータス切り替え"
    >
      {loading ? "更新中..." : `ステータス：${statusMap[status] || status}`}
    </button>
  );
}