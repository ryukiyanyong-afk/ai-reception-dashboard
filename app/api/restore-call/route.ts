import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "idがありません" },
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

    const { data: callData, error: callError } = await supabase
      .from("calls")
      .select("id, company_id")
      .eq("id", id)
      .single();

    if (callError || !callData) {
      return NextResponse.json(
        { error: "対象データが見つかりません" },
        { status: 404 }
      );
    }

    if (callData.company_id !== profile.company_id) {
      return NextResponse.json(
        { error: "この会社のデータではありません" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("calls")
      .update({
        deleted_at: null,
        deleted_by: null,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "復元に失敗しました" },
      { status: 500 }
    );
  }
}