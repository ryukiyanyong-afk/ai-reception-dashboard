import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, memo } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id がありません" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("calls")
      .update({ memo: memo ?? "" })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "unknown server error",
      },
      { status: 500 }
    );
  }
}