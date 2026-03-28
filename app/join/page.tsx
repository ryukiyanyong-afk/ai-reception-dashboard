"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type InviteInfo = {
  email: string;
  companyName: string;
  companyId: string;
};

export default function JoinPage() {
  const supabase = createClient();

  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadInvite() {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = searchParams.get("token") || "";

      if (!tokenFromUrl) {
        setErrorMessage("招待情報が見つかりません");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("invites")
        .select("email, company_id, companies(name)")
        .eq("token", tokenFromUrl)
        .eq("status", "pending")
        .single();

      if (error || !data) {
        setErrorMessage("招待リンクが無効か、期限切れです");
        setLoading(false);
        return;
      }

      const companyName = Array.isArray(data.companies)
        ? data.companies[0]?.name
        : (data.companies as { name?: string } | null)?.name;

      setInviteInfo({
        email: data.email,
        companyName: companyName || "会社名不明",
        companyId: data.company_id,
      });

      setLoading(false);
    }

    loadInvite();
  }, [supabase]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();

    if (!inviteInfo) return;

    setSending(true);
    setErrorMessage("");
    setSuccessMessage("");

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email: inviteInfo.email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
        data: {
          full_name: fullName,
          join_company_id: inviteInfo.companyId,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setSending(false);
      return;
    }

    setSuccessMessage(
      "認証メールを送信しました。メールのボタンを押して参加を完了してください。"
    );
    setSending(false);
  }

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
          maxWidth: 520,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
          招待を受けて参加
        </h1>

        <p style={{ color: "#666", marginTop: 10 }}>
          この会社への参加を完了するための画面です
        </p>

        <div style={{ marginTop: 20 }}>
          {loading ? (
            <div style={{ color: "#666" }}>招待情報を確認中...</div>
          ) : errorMessage ? (
            <div style={{ color: "red" }}>{errorMessage}</div>
          ) : (
            <>
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontSize: 14, color: "#666" }}>参加する会社</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
                  {inviteInfo?.companyName}
                </div>

                <div style={{ fontSize: 14, color: "#666", marginTop: 12 }}>
                  招待先メールアドレス
                </div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>
                  {inviteInfo?.email}
                </div>
              </div>

              <form
                onSubmit={handleJoin}
                style={{
                  marginTop: 20,
                  padding: 12,
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
                  参加情報入力
                </div>

                <input
                  type="text"
                  placeholder="お名前"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    marginBottom: 10,
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#111827",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {sending ? "送信中..." : "認証メールを送る"}
                </button>

                {errorMessage ? (
                  <div style={{ color: "red", marginTop: 12 }}>
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div style={{ color: "green", marginTop: 12 }}>
                    {successMessage}
                  </div>
                ) : null}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}