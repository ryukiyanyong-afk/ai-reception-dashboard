import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "IDがありません" },
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

    const { error } = await supabase
      .from("calls")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
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
      { error: "削除処理に失敗しました" },
      { status: 500 }
    );
  }
}