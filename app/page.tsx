import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import StatusButton from "./components/StatusButton";
import AddCallForm from "./components/AddCallForm";
import MemoEditor from "./components/MemoEditor";

type CallRow = {
  id: string;
  created_at: string;
  caller_phone: string | null;
  calls_name: string | null;
  purpose: string | null;
  urgency: string | null;
  summary: string | null;
  memo: string | null;
  status: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatDate(dateString: string | null) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUrgencyStyle(urgency: string | null) {
  if (urgency === "高") {
    return {
      background: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    };
  }

  if (urgency === "中") {
    return {
      background: "#fff7ed",
      color: "#c2410c",
      border: "1px solid #fdba74",
    };
  }

  return {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  };
}

function getStatusPriority(status: string | null) {
  if (status === "new") return 0;
  if (status === "in_progress") return 1;
  if (status === "done") return 2;
  return 99;
}

function getUrgencyPriority(urgency: string | null) {
  if (urgency === "高") return 0;
  if (urgency === "中") return 1;
  if (urgency === "低") return 2;
  return 99;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string; q?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const filter = params?.filter || "all";
  const q = params?.q?.trim() || "";

  const { data, error } = await supabase
    .from("calls")
    .select(
      "id, created_at, caller_phone, calls_name, purpose, urgency, summary, memo, status"
    )
    .order("created_at", { ascending: false });

  const calls: CallRow[] = data ?? [];

  const sortedCalls = [...calls].sort((a, b) => {
    const statusDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
    if (statusDiff !== 0) return statusDiff;

    const urgencyDiff =
      getUrgencyPriority(a.urgency) - getUrgencyPriority(b.urgency);
    if (urgencyDiff !== 0) return urgencyDiff;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const searchedCalls = q
    ? sortedCalls.filter((call) => {
        const keyword = q.toLowerCase();

        return (
          (call.calls_name || "").toLowerCase().includes(keyword) ||
          (call.caller_phone || "").toLowerCase().includes(keyword) ||
          (call.purpose || "").toLowerCase().includes(keyword) ||
          (call.summary || "").toLowerCase().includes(keyword) ||
          (call.memo || "").toLowerCase().includes(keyword)
        );
      })
    : sortedCalls;

  const filteredCalls =
    filter === "new"
      ? searchedCalls.filter((c) => c.status === "new")
      : filter === "in_progress"
      ? searchedCalls.filter((c) => c.status === "in_progress")
      : filter === "done"
      ? searchedCalls.filter((c) => c.status === "done")
      : searchedCalls;

  const totalCount = calls.length;
  const newCount = calls.filter((c) => c.status === "new").length;
  const inProgressCount = calls.filter((c) => c.status === "in_progress").length;
  const doneCount = calls.filter((c) => c.status === "done").length;

  const filterButtonStyle = (isActive: boolean) => ({
    padding: "10px 14px",
    borderRadius: 999,
    border: isActive ? "1px solid #111827" : "1px solid #d1d5db",
    background: isActive ? "#111827" : "#fff",
    color: isActive ? "#fff" : "#111827",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
    display: "inline-block",
  });

  const makeFilterHref = (nextFilter: string) => {
    const query = new URLSearchParams();
    query.set("filter", nextFilter);
    if (q) query.set("q", q);
    return `/?${query.toString()}`;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f8",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            AI受付ダッシュボード
          </h1>
          <p style={{ color: "#666", marginTop: 8 }}>
            AIが対応した電話内容の一覧
          </p>
        </div>

        <AddCallForm />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, color: "#666" }}>総受電件数</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{totalCount}件</div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, color: "#666" }}>未対応</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{newCount}件</div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, color: "#666" }}>対応中</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{inProgressCount}件</div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, color: "#666" }}>対応完了</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{doneCount}件</div>
          </div>
        </div>

        <form
          method="GET"
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <input type="hidden" name="filter" value={filter} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="会社名・電話番号・用件・要約・メモで検索"
            style={{
              flex: "1 1 320px",
              minWidth: 280,
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              background: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            検索
          </button>
          <Link
            href={`/?filter=${filter}`}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#111827",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            クリア
          </Link>
        </form>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link href={makeFilterHref("all")} style={filterButtonStyle(filter === "all")}>
            すべて
          </Link>
          <Link href={makeFilterHref("new")} style={filterButtonStyle(filter === "new")}>
            未対応
          </Link>
          <Link href={makeFilterHref("in_progress")} style={filterButtonStyle(filter === "in_progress")}>
            対応中
          </Link>
          <Link href={makeFilterHref("done")} style={filterButtonStyle(filter === "done")}>
            対応完了
          </Link>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0 }}>
            受電一覧
          </h2>

          {error ? (
            <div style={{ color: "red", marginTop: 12 }}>
              データ取得エラー: {error.message}
            </div>
          ) : filteredCalls.length === 0 ? (
            <div style={{ color: "#666", marginTop: 12 }}>
              該当するデータがありません
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 16,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    {call.calls_name || "名前なし"}
                  </div>

                  <div style={{ color: "#666", marginTop: 8 }}>
                    電話番号：{call.caller_phone || "-"}
                  </div>

                  <div style={{ color: "#666", marginTop: 4 }}>
                    用件：{call.purpose || "-"}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <span
                      style={{
                        ...getUrgencyStyle(call.urgency),
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      緊急度：{call.urgency || "-"}
                    </span>
                  </div>

                  <div style={{ color: "#666", marginTop: 8 }}>
                    要約：{call.summary || "-"}
                  </div>

                  <MemoEditor id={call.id} initialMemo={call.memo} />

                  <div style={{ marginTop: 8 }}>
                    <StatusButton id={call.id} initialStatus={call.status} />
                  </div>

                  <div style={{ color: "#666", marginTop: 8 }}>
                    受付時刻：{formatDate(call.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}