import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

type SaveCallWebhookBody = {
  company_id?: string;
  calls_name?: string;
  caller_phone?: string;
  purpose?: string;
  urgency?: string;
  summary?: string;
  memo?: string;
  status?: string;
};

function normalizeUrgency(value?: string) {
  if (value === "高" || value === "中" || value === "低") return value;
  return "中";
}

function normalizeStatus(value?: string) {
  if (value === "new" || value === "in_progress" || value === "done") return value;
  return "new";
}

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-webhook-secret");
    const expectedSecret = process.env.AI_WEBHOOK_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: "AI_WEBHOOK_SECRET が未設定です" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as SaveCallWebhookBody;

    if (!body.company_id) {
      return NextResponse.json(
        { error: "company_id がありません" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", body.company_id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: "company_id が不正です" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("calls")
      .insert({
        company_id: body.company_id,
        calls_name: body.calls_name?.trim() || "不明",
        caller_phone: body.caller_phone?.trim() || null,
        purpose: body.purpose?.trim() || null,
        urgency: normalizeUrgency(body.urgency),
        summary: body.summary?.trim() || null,
        memo: body.memo?.trim() || null,
        status: normalizeStatus(body.status),
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch {
    return NextResponse.json(
      { error: "保存に失敗しました" },
      { status: 500 }
    );
  }
}