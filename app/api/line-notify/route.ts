import { NextResponse } from "next/server";

async function sendLineMessage(text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token || !userId) {
    throw new Error("LINE env is missing");
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    }),
  });

  const result = await res.text();

  if (!res.ok) {
    throw new Error(`LINE push failed: ${result}`);
  }

  return result;
}

export async function GET() {
  try {
    const text = `📞 LINE通知テスト

HOPESの通知テストです。
このメッセージが届けば、LINE送信は成功です。`;

    await sendLineMessage(text);

    return NextResponse.json({ ok: true, message: "test sent" });
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected error", detail: String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const text = `📞 新しい受電

要約：${body.summary || "要約なし"}

会社名：${body.company || "不明"}
電話番号：${body.phone || "不明"}
用件：${body.inquiryType || "未分類"}
緊急度：${body.urgency || "未判定"}`;

    await sendLineMessage(text);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected error", detail: String(e) },
      { status: 500 }
    );
  }
}