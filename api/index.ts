import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Endpoints ---

// 1. Contact Form Endpoint
app.post(
  "/api/contact",
  async (req: express.Request, res: express.Response) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "kokomu.matsuo@mgc-global01.com";
    const recipients = [receiverEmail, "jayden.barnes@mgc-global01.com"];

    try {
      const { error } = await resend.emails.send({
        from: "MGC Contact Form <onboarding@resend.dev>",
        replyTo: email,
        to: recipients,
        subject: `[MGC Contact] New message from ${name}`,
        text: `
Name: ${name}
Email: ${email}

Message:
${message}
        `.trim(),
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">[MGC Contact] New message from ${name}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <hr style="border: 1px solid #e5e7eb;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });

      if (error) {
        console.error("[Backend] Resend error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send email.",
        });
      }

      console.log(`[Backend] Email sent for ${name} → ${recipients.join(", ")}`);
      res.status(200).json({ success: true, message: "Message sent successfully." });
    } catch (error) {
      console.error("[Backend] Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while sending email.",
      });
    }
  }
);

// 2. Image Generation Proxy Endpoint
// This hides the API KEY from the client
app.post(
  "/api/generate-image",
  async (req: express.Request, res: express.Response) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("[Backend] GEMINI_API_KEY present:", !!apiKey, "length:", apiKey?.length ?? 0);

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const genAI = new GoogleGenAI({ apiKey });
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-image";
      console.log("[Backend] Using model:", model);

      const response = await (genAI as any).models.generateContent({
        model,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const images: { base64: string; mimeType: string }[] = [];
      for (const part of response?.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          images.push({
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || "image/jpeg",
          });
        }
      }

      res.json({ images });
    } catch (error) {
      console.error("[Backend] Image generation error:", error);
      res.status(500).json({ error: "Failed to generate image.", detail: String(error) });
    }
  }
);

// --- Lead storage (Supabase REST / PostgREST) ---
// service_role キーで書き込む。テーブルはRLS有効＋ポリシー無しなので、
// このサーバー経由以外（anonキー）からは読み書きできない。
// 環境変数が未設定なら保存はスキップする（診断機能自体は止めない）。
async function saveLead(row: Record<string, unknown>): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("[Backend] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未設定のためリード保存をスキップしました");
    return;
  }
  const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/diagnosis_leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`Supabase insert failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
}

// 3. AI Utilization Diagnosis Endpoint
// 訪問者の状況からAI導入後のワークフロー・期待効果を「要件定義っぽく」診断して返す。
// 無料フロントエンド（リード獲得 → 30分無料相談への転換）。
app.post(
  "/api/diagnose",
  async (req: express.Request, res: express.Response) => {
    const {
      email,
      name = "",
      company = "",
      industry = "",
      business = "",
      employees = "",
      challenges = [],
      tools = "",
      monthly = "",
      goal = "",
    } = req.body || {};

    const validEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      return res.status(400).json({ error: "有効なメールアドレスが必要です。" });
    }
    if (!industry && !business) {
      return res.status(400).json({ error: "業種または事業内容を入力してください。" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    // GEMINI_TEXT_MODEL 指定を最優先。未ヒット時は最新エイリアス→2.5系へフォールバック。
    const MODELS = [
      ...(process.env.GEMINI_TEXT_MODEL ? [process.env.GEMINI_TEXT_MODEL] : []),
      "gemini-3.0-flash",
      "gemini-3-flash",
      "gemini-flash-latest",
      "gemini-3.0-pro",
      "gemini-2.5-flash",
    ];

    const challengesText = Array.isArray(challenges) ? challenges.join("、") : String(challenges || "");

    const prompt = `あなたはMGC株式会社（AI導入支援の会社）のシニアAIコンサルタントです。
以下の相談者情報をもとに、そのまま提案書の下敷きになる「AI活用診断レポート」を作成してください。
一般論で薄めず、相談者の業種・課題に具体的に踏み込むこと。断定的で実務的な日本語。数値は妥当な前提を置いて概算し、前提を必ず明記する。

# 相談者情報
- 業種: ${industry || "(未記入)"}
- 事業内容: ${business || "(未記入)"}
- 従業員規模: ${employees || "(未記入)"}
- 今の課題: ${challengesText || "(未記入)"}
- 現在使っているツール: ${tools || "(未記入)"}
- 関連する月間コスト/売上感: ${monthly || "(未記入)"}
- 達成したいこと: ${goal || "(未記入)"}

# 出力ルール
- 必ず下記のJSONのみを出力（前後に説明・マークダウン・コードフェンス禁止）。
- recommendedUseCases は3件。workflow は4〜6工程で、before は現状の手作業、after はAI導入後を具体的に。
- expectedEffect.hoursSavedPerMonth は月あたりの削減工数（時間・数値）、costReductionYenPerMonth は月あたりの人件費換算削減額（円・数値）。
- roas は広告・マーケティング・EC・集客が関係する場合のみ短い試算文、無関係ならnull。
- assumptions に試算の前提（時給・件数など）を2〜3個。requirements は要件定義ドラフトを4〜6項目。firstSteps は最初の一歩を3項目。riskNotes は注意点を1〜2項目。

# JSON形式
{
  "summary": "総括を2〜3文",
  "recommendedUseCases": [{"title": "施策名", "why": "なぜ効くか", "how": "AIでどう実現するか"}],
  "workflow": [{"step": "工程名", "before": "現状(手作業)", "after": "AI導入後"}],
  "expectedEffect": {"hoursSavedPerMonth": 0, "costReductionYenPerMonth": 0, "roiNote": "投資対効果の一言", "roas": null, "assumptions": ["前提1"]},
  "requirements": ["要件1"],
  "firstSteps": ["ステップ1"],
  "riskNotes": ["注意点1"]
}`;

    let diagnosis: any = null;
    let usedModel = "";
    // 失敗時の切り分け用。上流のHTTPステータスのみを記録する（本文・キーは含めない）。
    const attemptCodes: string[] = [];
    try {
      const genAI = new GoogleGenAI({ apiKey });
      let lastErr: any = null;
      for (const m of MODELS) {
        try {
          const response = await (genAI as any).models.generateContent({
            model: m,
            contents: { parts: [{ text: prompt }] },
            config: { temperature: 0.6, maxOutputTokens: 4096, responseMimeType: "application/json" },
          });
          let text = response?.text;
          if (!text) {
            text = (response?.candidates?.[0]?.content?.parts || [])
              .map((p: any) => p?.text || "")
              .join("");
          }
          if (!text) throw new Error("empty response");
          diagnosis = JSON.parse(String(text).replace(/^```json\s*|\s*```$/g, "").trim());
          usedModel = m;
          break;
        } catch (e) {
          lastErr = e;
          const msg = String((e as any)?.message || e);
          const status = (e as any)?.status ?? (msg.match(/\b(4\d{2}|5\d{2})\b/) || [])[1];
          attemptCodes.push(`${m}:${status || (msg.includes("JSON") ? "parse" : "err")}`);
          console.warn(`[Backend] diagnose model ${m} failed:`, msg.slice(0, 300));
        }
      }
      if (!diagnosis) throw lastErr || new Error("no model succeeded");
    } catch (error) {
      console.error("[Backend] Diagnose generation error:", error);
      // code は「どのモデルがどのHTTPステータスで落ちたか」だけ。運用切り分け用で、機密は含まない。
      return res.status(500).json({
        error: "診断の生成に失敗しました。時間をおいて再度お試しください。",
        code: attemptCodes.join(","),
      });
    }

    // リード保存（失敗しても診断結果は返す）
    try {
      await saveLead({
        email,
        name: name || null,
        company: company || null,
        industry: industry || null,
        business: business || null,
        employees: employees || null,
        challenges: Array.isArray(challenges) ? challenges : null,
        tools: tools || null,
        monthly: monthly || null,
        goal: goal || null,
        summary: diagnosis?.summary || null,
        hours_saved_per_month: typeof diagnosis?.expectedEffect?.hoursSavedPerMonth === "number"
          ? diagnosis.expectedEffect.hoursSavedPerMonth : null,
        cost_reduction_yen_per_month: typeof diagnosis?.expectedEffect?.costReductionYenPerMonth === "number"
          ? diagnosis.expectedEffect.costReductionYenPerMonth : null,
        roas: diagnosis?.expectedEffect?.roas || null,
        diagnosis,
        model: usedModel || null,
        referer: req.get("referer") || null,
        user_agent: req.get("user-agent") || null,
      });
      console.log(`[Backend] Diagnose lead saved: ${email}`);
    } catch (dbErr) {
      console.error("[Backend] Diagnose lead save failed (non-fatal):", dbErr);
    }

    // リード通知（失敗しても診断結果は返す）
    try {
      const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "kokomu.matsuo@mgc-global01.com";
      const recipients = [receiverEmail, "jayden.barnes@mgc-global01.com"];
      await resend.emails.send({
        from: "MGC AI診断 <onboarding@resend.dev>",
        replyTo: email,
        to: recipients,
        subject: `[MGC AI診断リード] ${company || name || email}`,
        text: `
新しいAI活用診断リードです。

Name: ${name || "(未記入)"}
Company: ${company || "(未記入)"}
Email: ${email}

業種: ${industry || "(未記入)"}
事業内容: ${business || "(未記入)"}
従業員規模: ${employees || "(未記入)"}
課題: ${challengesText || "(未記入)"}
使用ツール: ${tools || "(未記入)"}
月間コスト/売上感: ${monthly || "(未記入)"}
達成したいこと: ${goal || "(未記入)"}

--- 診断サマリー ---
${diagnosis?.summary || ""}
（使用モデル: ${usedModel}）
        `.trim(),
      });
      console.log(`[Backend] Diagnose lead captured: ${email} (model ${usedModel})`);
    } catch (mailErr) {
      console.error("[Backend] Diagnose lead email failed (non-fatal):", mailErr);
    }

    res.json({ diagnosis });
  }
);

// Export for Vercel
export default app;
