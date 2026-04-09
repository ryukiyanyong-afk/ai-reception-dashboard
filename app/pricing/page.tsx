export default function PricingPage() {
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  };

  const featureStyle: React.CSSProperties = {
    margin: "8px 0",
    color: "#374151",
    lineHeight: 1.7,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
        fontFamily: "sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "72px 20px 48px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: "#eef2ff",
              color: "#3730a3",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            株式会社HOPES
          </div>

          <h1
            style={{
              fontSize: 40,
              lineHeight: 1.25,
              margin: 0,
              fontWeight: 800,
            }}
          >
            電話の取りこぼしを減らし、
            <br />
            営業時間外や不在時の受付を整えます
          </h1>

          <p
            style={{
              marginTop: 18,
              fontSize: 17,
              lineHeight: 1.9,
              color: "#4b5563",
            }}
          >
            株式会社HOPESでは、AI電話受付を単なる自動応答ではなく、
            実運用を前提とした導入支援付きでご提供しています。
            初月は無料でお試しいただけます。
          </p>

          <div style={{ marginTop: 28 }}>
            <a
              href="#plans"
              style={{
                display: "inline-block",
                background: "#111827",
                color: "#fff",
                textDecoration: "none",
                padding: "14px 22px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              まずは無料で相談する
            </a>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px 24px",
        }}
      >
        <div
          style={{
            ...cardStyle,
            background: "#111827",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 28, marginTop: 0, marginBottom: 12 }}>
            料金について
          </h2>
          <p
            style={{
              margin: 0,
              color: "#d1d5db",
              lineHeight: 1.9,
              fontSize: 16,
            }}
          >
            初月は無料でお試しいただけます。
            <br />
            継続利用をご希望の場合のみ、2か月目から導入サポート費および月額利用料が発生します。
            <br />
            各プランとも、実際の運用を前提とした導入支援付きです。
          </p>
        </div>
      </section>

      <section
        id="plans"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 20px 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>
              標準導入プラン
            </div>
            <h3 style={{ fontSize: 28, margin: "10px 0 6px" }}>月額 9,800円</h3>
            <div style={{ color: "#6b7280", marginBottom: 18 }}>
              導入サポート費 29,800円
            </div>

            <div style={featureStyle}>・1ユーザー利用</div>
            <div style={featureStyle}>・標準的な受付導入設定</div>
            <div style={featureStyle}>・基本文言の初期設定</div>
            <div style={featureStyle}>・通知先の初期設定</div>
            <div style={featureStyle}>・管理画面の利用開始サポート</div>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: "#f3f4f6",
                color: "#374151",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              初月無料
              <br />
              継続利用をご希望の場合のみ、2か月目から導入サポート費および月額利用料が発生します。
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              border: "2px solid #111827",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                right: 20,
                background: "#111827",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              おすすめ
            </div>

            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>
              運用支援プラン
            </div>
            <h3 style={{ fontSize: 28, margin: "10px 0 6px" }}>月額 19,800円</h3>
            <div style={{ color: "#6b7280", marginBottom: 18 }}>
              導入サポート費 59,800円
            </div>

            <div style={featureStyle}>・3ユーザー利用</div>
            <div style={featureStyle}>・標準導入設定</div>
            <div style={featureStyle}>・受付文言の調整</div>
            <div style={featureStyle}>・通知先設定の最適化</div>
            <div style={featureStyle}>・運用開始時の支援</div>
            <div style={featureStyle}>・初期の利用状況に応じた見直し対応</div>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: "#eef2ff",
                color: "#3730a3",
                fontSize: 14,
                lineHeight: 1.8,
                fontWeight: 700,
              }}
            >
              初月無料
              <br />
              継続利用をご希望の場合のみ、2か月目から導入サポート費および月額利用料が発生します。
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 700 }}>
              専用対応プラン
            </div>
            <h3 style={{ fontSize: 28, margin: "10px 0 6px" }}>月額 39,800円</h3>
            <div style={{ color: "#6b7280", marginBottom: 18 }}>
              導入サポート費 119,800円
            </div>

            <div style={featureStyle}>・10ユーザー利用</div>
            <div style={featureStyle}>・導入設計の個別調整</div>
            <div style={featureStyle}>・受付内容の個別最適化</div>
            <div style={featureStyle}>・通知フローの個別設計</div>
            <div style={featureStyle}>・優先対応</div>
            <div style={featureStyle}>・継続運用を前提とした調整支援</div>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: "#f3f4f6",
                color: "#374151",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              初月無料
              <br />
              継続利用をご希望の場合のみ、2か月目から導入サポート費および月額利用料が発生します。
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px 24px",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ fontSize: 24, marginTop: 0 }}>ご案内事項</h2>
          <div style={{ color: "#4b5563", lineHeight: 1.9 }}>
            <div>※初月無料期間中は標準導入範囲でのご提供となります。</div>
            <div>※特別なカスタマイズや個別開発が必要な場合は、別途お見積りとなります。</div>
            <div>※継続利用の有無は無料期間終了前にご確認いたします。</div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        <div
          style={{
            ...cardStyle,
            textAlign: "center",
            background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)",
          }}
        >
          <h2 style={{ fontSize: 28, marginTop: 0 }}>
            まずは実際の運用に近い形でお試しください
          </h2>
          <p
            style={{
              maxWidth: 720,
              margin: "0 auto",
              color: "#4b5563",
              lineHeight: 1.9,
              fontSize: 16,
            }}
          >
            導入前に、実際の受電運用に近い形でご確認いただけます。
            ご相談内容に応じて、最適な導入方法をご案内します。
          </p>

          <div style={{ marginTop: 24 }}>
            <a
              href="/contact"
              style={{
                display: "inline-block",
                background: "#111827",
                color: "#fff",
                textDecoration: "none",
                padding: "14px 22px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              無料で相談する
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}