"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("ログインに失敗しました: " + error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

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
          maxWidth: 420,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          ログイン
        </h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          AI受付ダッシュボードにログイン
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: "grid", gap: 12, marginTop: 20 }}
        >
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 10,
            }}
          />

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 10,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 16px",
              border: "none",
              borderRadius: 10,
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 14, textAlign: "center" }}>
  アカウントをお持ちでない方は{" "}
  <a
    href="/signup"
    style={{
      color: "#111827",
      fontWeight: 700,
      textDecoration: "none",
    }}
  >
    新規登録はこちら
  </a>
</div>
      </div>
    </main>
  );
}