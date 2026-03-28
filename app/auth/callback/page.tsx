"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AuthCallbackPage() {
  const supabase = createClient();
  const [message, setMessage] = useState("認証処理中です...");

  useEffect(() => {
    async function handleAuth() {
      const hash = window.location.hash;
      const query = window.location.search;

      if (hash.includes("access_token") || query.includes("code=")) {
        setMessage("認証が完了しました。ダッシュボードへ移動します...");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

        return;
      }

      setMessage("認証情報が見つかりませんでした");
    }

    handleAuth();
  }, [supabase]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          認証確認
        </h1>
        <p style={{ color: "#666", marginTop: 16 }}>{message}</p>
      </div>
    </main>
  );
}