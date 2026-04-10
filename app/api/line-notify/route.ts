import { NextResponse } from "next/server";

async function pushLineMessage(text: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token || !userId) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID is missing");
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

  const resultText = await res.text();

  if (!res.ok) {
    throw new Error(`LINE push failed: ${resultText}`);
  }

  return resultText;
}

// ブラウザで /api/line-notify を開いた時のテスト用
export async function GET() {
  try {
    const text = `📞 LINE通知テスト

HOPESの通知テストです。
このメッセージが届けば、LINE通知は成功です。`;

    await pushLineMessage(text);

    return NextResponse.json({
      ok: true,
      message: "LINE test sent",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// 他のAPIから呼ばれる本番用
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const text = `📞 新しい受電

要約：${body.summary || "要約なし"}
会社名：${body.company || "不明"}
電話番号：${body.phone || "不明"}
用件：${body.inquiryType || "未分類"}
緊急度：${body.urgency || "未判定"}`;

    await pushLineMessage(text);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}