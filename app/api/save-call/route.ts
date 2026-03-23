import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      caller_phone,
      calls_name,
      purpose,
      urgency,
      summary,
      status,
      memo,
    } = body;

    const { data, error } = await supabase
      .from("calls")
      .insert([
        {
          caller_phone,
          calls_name,
          purpose,
          urgency,
          summary,
          status: status ?? "new",
          memo: memo ?? "",
        },
      ])
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