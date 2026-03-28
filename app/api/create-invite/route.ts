import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスがありません" },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ログインユーザーが取得できません" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      return NextResponse.json(
        { error: "会社情報が取得できません" },
        { status: 400 }
      );
    }

    const token = crypto.randomUUID().replace(/-/g, "");
    const origin = new URL(request.url).origin;

    const { error: inviteError } = await supabase.from("invites").insert({
      company_id: profile.company_id,
      email,
      token,
      role: "member",
      status: "pending",
    });

    if (inviteError) {
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      );
    }

    const inviteUrl = `${origin}/join?token=${token}`;

    return NextResponse.json({
      success: true,
      inviteUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "招待リンクの作成に失敗しました" },
      { status: 500 }
    );
  }
}