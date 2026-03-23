"use client";

import { useState } from "react";

type Props = {
  id: string;
  initialMemo: string | null;
};

export default function MemoEditor({ id, initialMemo }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [memo, setMemo] = useState(initialMemo ?? "");
  const [savedMemo, setSavedMemo] = useState(initialMemo ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/update-memo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          memo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("メモ保存に失敗しました: " + (data.error || "不明なエラー"));
        setLoading(false);
        return;
      }

      setSavedMemo(memo);
      setIsEditing(false);
      setLoading(false);
      alert("メモを保存しました");
    } catch (error) {
      alert(
        "通信エラーが発生しました: " +
          (error instanceof Error ? error.message : String(error))
      );
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMemo(savedMemo);
    setIsEditing(false);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ color: "#666", marginBottom: 6 }}>
        対応メモ：{savedMemo.trim() ? savedMemo : "-"}
      </div>

      {isEditing ? (
        <div style={{ display: "grid", gap: 8 }}>
          <textarea
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

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #111827",
                background: "#111827",
                color: "#fff",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "保存中..." : "メモ保存"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#111827",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#111827",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          メモ編集
        </button>
      )}
    </div>
  );
}