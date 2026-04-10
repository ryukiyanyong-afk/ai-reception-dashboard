import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SaveCallBody = {
  company_id?: string;
  calls_name?: string;
  caller_phone?: string;
  purpose?: string;
  urgency?: string;
  summary?: string;
  memo?: string;
  status?: string;
};

function normalizeUrgency(value?: string | null) {
  if (!value) return "未判定";

  const v = value.trim();

  if (["高", "high", "High", "HIGH", "緊急"].includes(v)) return "高";
  if (["中", "medium", "Medium", "MEDIUM", "普通"].includes(v)) return "中";
  if (["低", "low", "Low", "LOW"].includes(v)) return "低";

  return v;
}

function normalizeStatus(value?: string | null) {
  if (!value) return "未対応";

  const v = value.trim();

  if (["未対応", "new", "NEW"].includes(v)) return "未対応";
  if (["対応中", "progress", "PROGRESS", "in_progress"].includes(v)) return "対応中";
  if (["対応完了", "done", "DONE", "completed"].includes(v)) return "対応完了";

  return v;
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.AI_WEBHOOK_SECRET;
    const requestSecret = request.headers.get("x-ai-webhook-secret");

    if (!webhookSecret || requestSecret !== webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as SaveCallBody;

    if (!body.company_id) {
      return NextResponse.json(
        { error: "company_id is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase env is missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const insertPayload = {
      company_id: body.company_id,
      calls_name: body.calls_name?.trim() || "不明",
      caller_phone: body.caller_phone?.trim() || null,
      purpose: body.purpose?.trim() || "未分類",
      urgency: normalizeUrgency(body.urgency),
      summary: body.summary?.trim() || "要約なし",
      memo: body.memo?.trim() || null,
      status: normalizeStatus(body.status),
    };

    const { data, error } = await supabase
      .from("calls")
      .insert(insertPayload)
      .select("id, calls_name, caller_phone, purpose, urgency, summary")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      return NextResponse.json(
        {
          ok: true,
          saved: true,
          lineNotified: false,
          id: data.id,
          warning: "APP_URL is missing",
        },
        { status: 200 }
      );
    }

    const lineNotifyRes = await fetch(`${appUrl}/api/line-notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: data.calls_name || "不明",
        phone: data.caller_phone || "不明",
        inquiryType: data.purpose || "未分類",
        summary: data.summary || "要約なし",
        urgency: data.urgency || "未判定",
      }),
    });

    const lineNotifyResult = await lineNotifyRes.text();

    if (!lineNotifyRes.ok) {
      return NextResponse.json(
        {
          ok: true,
          saved: true,
          lineNotified: false,
          id: data.id,
          lineError: lineNotifyResult,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      lineNotified: true,
      id: data.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "保存に失敗しました",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}