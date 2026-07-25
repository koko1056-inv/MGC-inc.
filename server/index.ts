import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

    try {
      // Note: To use this, you need to set up your SMTP credentials in .env
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: [process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER, "jayden.barnes@mgc-global01.com"].filter(Boolean),
        subject: `[MGC Contact] New message from ${name}`,
        text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Backend] Email sent for ${name}`);
      res
        .status(200)
        .json({ success: true, message: "Message sent successfully." });
    } catch (error) {
      console.error("[Backend] Contact form error:", error);
      res
        .status(500)
        .json({
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

    try {
      const response = await (genAI as any).models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
    });

    res.json(response);
    } catch (error) {
      console.error("[Backend] Image generation error:", error);
      res.status(500).json({ error: "Failed to generate image." });
    }
  }
);

// --- Lead storage (Supabase REST) — local dev mirror ---
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

// 3. AI Utilization Diagnosis Endpoint (local dev mirror of api/index.ts)
app.post(
  "/api/diagnose",
  async (req: express.Request, res: express.Response) => {
    const {
      email, name = "", company = "", industry = "", business = "",
      employees = "", challenges = [], tools = "", monthly = "", goal = "",
    } = req.body || {};

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "有効なメールアドレスが必要です。" });
    }
    if (!industry && !business) {
      return res.status(400).json({ error: "業種または事業内容を入力してください。" });
    }

    const MODELS = [
      ...(process.env.GEMINI_TEXT_MODEL ? [process.env.GEMINI_TEXT_MODEL] : []),
      "gemini-3.0-flash", "gemini-3-flash", "gemini-flash-latest", "gemini-3.0-pro", "gemini-2.5-flash",
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
- assumptions に試算の前提を2〜3個。requirements は要件定義ドラフトを4〜6項目。firstSteps は最初の一歩を3項目。riskNotes は注意点を1〜2項目。

# JSON形式
{"summary":"","recommendedUseCases":[{"title":"","why":"","how":""}],"workflow":[{"step":"","before":"","after":""}],"expectedEffect":{"hoursSavedPerMonth":0,"costReductionYenPerMonth":0,"roiNote":"","roas":null,"assumptions":[""]},"requirements":[""],"firstSteps":[""],"riskNotes":[""]}`;

    let diagnosis: any = null;
    let usedModel = "";
    try {
      let lastErr: any = null;
      for (const m of MODELS) {
        try {
          const response = await (genAI as any).models.generateContent({
            model: m,
            contents: { parts: [{ text: prompt }] },
            config: { temperature: 0.6, maxOutputTokens: 4096, responseMimeType: "application/json" },
          });
          let text = response?.text;
          if (!text) text = (response?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || "").join("");
          if (!text) throw new Error("empty response");
          diagnosis = JSON.parse(String(text).replace(/^```json\s*|\s*```$/g, "").trim());
          usedModel = m;
          break;
        } catch (e) {
          lastErr = e;
          console.warn(`[Backend] diagnose model ${m} failed:`, String(e).slice(0, 160));
        }
      }
      if (!diagnosis) throw lastErr || new Error("no model succeeded");
    } catch (error) {
      console.error("[Backend] Diagnose generation error:", error);
      return res.status(500).json({ error: "診断の生成に失敗しました。時間をおいて再度お試しください。" });
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

    // リード通知（SMTP設定があれば送信、失敗しても診断結果は返す）
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({
          from: `"MGC AI診断" <${process.env.EMAIL_USER}>`,
          replyTo: email,
          to: [process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER, "jayden.barnes@mgc-global01.com"].filter(Boolean) as string[],
          subject: `[MGC AI診断リード] ${company || name || email}`,
          text: `新しいAI活用診断リード\n\nName: ${name}\nCompany: ${company}\nEmail: ${email}\n業種: ${industry}\n事業内容: ${business}\n従業員規模: ${employees}\n課題: ${challengesText}\n使用ツール: ${tools}\n月間コスト/売上感: ${monthly}\n達成したいこと: ${goal}\n\n--- サマリー ---\n${diagnosis?.summary || ""}\n（model: ${usedModel}）`,
        });
      }
    } catch (mailErr) {
      console.error("[Backend] Diagnose lead email failed (non-fatal):", mailErr);
    }

    res.json({ diagnosis });
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Backend] Server running at http://localhost:${PORT}`);
});
