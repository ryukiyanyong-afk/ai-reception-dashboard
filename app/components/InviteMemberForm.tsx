"use client";

import { useState } from "react";

export default function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setInviteUrl("");

    try {
      const res = await fetch("/api/create-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "招待リンクの作成に失敗しました");
        setLoading(false);
        return;
      }

      setInviteUrl(data.inviteUrl || "");
      setSuccessMessage("招待準備ができました。コピーするか、メールで送ってください。");
    } catch {
      setErrorMessage("通信エラーが発生しました");
    }

    setLoading(false);
  }

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    alert("招待リンクをコピーしました");
  }

  function handleOpenMail() {
    if (!inviteUrl || !email) return;

    const subject = encodeURIComponent("AI受付ダッシュボードへの招待");
    const body = encodeURIComponent(
      `AI受付ダッシュボードに招待されています。\n\n以下のリンクから参加してください。\n\n${inviteUrl}`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0 }}>
        メンバー招待
      </h2>

      <form
        onSubmit={handleInvite}
        style={{ display: "grid", gap: 12, marginTop: 12 }}
      >
        <input
          type="email"
          placeholder="招待したいメールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "#fff",
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
          {loading ? "送信中..." : "招待メールを送信する"}
        </button>
      </form>

      {errorMessage ? (
        <div style={{ color: "red", marginTop: 12 }}>{errorMessage}</div>
      ) : null}

      {inviteUrl ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
            {successMessage || "招待準備ができました"}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111827",
                background: "#fff",
                color: "#111827",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              コピー
            </button>

            <button
              type="button"
              onClick={handleOpenMail}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#111827",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              メールで送る
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}