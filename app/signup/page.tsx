"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert("新規登録に失敗しました: " + error.message);
      return;
    }

    alert("登録しました。メール確認が必要な場合は確認してください。");
    router.push("/login");
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
          maxWidth: 480,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          新規登録
        </h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          1ヶ月無料トライアルで開始
        </p>

        <form
          onSubmit={handleSignup}
          style={{ display: "grid", gap: 12, marginTop: 20 }}
        >
          <input
            type="text"
            placeholder="会社名"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={{
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 10,
            }}
          />

          <input
            type="text"
            placeholder="お名前"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              padding: 12,
              border: "1px solid #d1d5db",
              borderRadius: 10,
            }}
          />

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
            {loading ? "登録中..." : "無料で始める"}
          </button>
        </form>
      </div>
    </main>
  );
}
