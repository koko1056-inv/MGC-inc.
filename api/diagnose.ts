// AI活用診断（POST /api/diagnose）。入力からAI導入後のワークフロー・期待効果を診断して返し、
// リードとして保存・通知する。
//
// 画面の診断（App.tsx の SHOW_DIAGNOSIS）を隠している間は、環境変数 DIAGNOSIS_ENABLED=true を
// 設定しない限り動かない（Gemini の利用料がかかるため、外から呼ばれないようにする）。
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import { json, readJson, rateLimited, clientIp, str, isEmail, oneLine, isBot } from "./_lib/guard.js";

// --- Lead storage (Supabase REST / PostgREST) ---
// service_role キーで書き込む。テーブルはRLS有効＋ポリシー無しなので、
// このサーバー経由以外（anonキー）からは読み書きできない。
// 環境変数が未設定なら保存はスキップする（診断機能自体は止めない）。
// 戻り値は保存結果の短いコード。運用切り分け用で、機密は含まない。
//   stored          … 保存成功
//   skipped_no_env  … 環境変数が未設定（保存せず診断は継続）
//   error_<status>  … Supabaseがエラーを返した
//   error_network   … 通信自体が失敗
async function saveLead(row: Record<string, unknown>): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn(
      `[diagnose] リード保存をスキップ: SUPABASE_URL=${url ? "設定済" : "未設定"} SUPABASE_SERVICE_ROLE_KEY=${key ? "設定済" : "未設定"}`
    );
    return "skipped_no_env";
  }
  let res: Response;
  try {
    res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/diagnosis_leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
  } catch (e) {
    console.error("[diagnose] Supabase insert network error:", String((e as any)?.message || e).slice(0, 300));
    return "error_network";
  }
  if (!res.ok) {
    console.error(`[diagnose] Supabase insert failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return `error_${res.status}`;
  }
  return "stored";
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (process.env.DIAGNOSIS_ENABLED !== "true") {
      return json({ error: "現在、AI活用診断は受け付けていません。" }, 404);
    }
    const parsed = await readJson(request);
    if ("error" in parsed) return parsed.error;
    const { body } = parsed;
    if (isBot(body)) return json({ error: "診断の生成に失敗しました。" }, 400);

    // 同じ送信元から1時間に3件まで（1件ごとに Gemini の利用料がかかる）
    if (rateLimited(`diagnose:${clientIp(request)}`, 3, 60 * 60 * 1000)) {
      return json({ error: "短時間に多くの診断が行われました。時間をおいて再度お試しください。" }, 429);
    }

    // 入力はすべて文字列にそろえ、長さに上限を設ける（AIへの指示に混ぜるため）
    const email = str(body.email, 254);
    const name = str(body.name, 100);
    const company = str(body.company, 200);
    const industry = str(body.industry, 200);
    const business = str(body.business, 1000);
    const employees = str(body.employees, 100);
    const tools = str(body.tools, 500);
    const monthly = str(body.monthly, 200);
    const goal = str(body.goal, 1000);
    const challenges = (Array.isArray(body.challenges) ? body.challenges : []).slice(0, 12).map((c) => str(c, 100)).filter(Boolean);

    if (!isEmail(email)) {
      return json({ error: "有効なメールアドレスが必要です。" }, 400);
    }
    if (!industry && !business) {
      return json({ error: "業種または事業内容を入力してください。" }, 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[diagnose] GEMINI_API_KEY is not set");
      return json({ error: "診断の生成に失敗しました。時間をおいて再度お試しください。" }, 500);
    }

    // GEMINI_TEXT_MODEL 指定を最優先。未ヒット時は最新エイリアス→2.5系へフォールバック。
    const MODELS = [
      ...(process.env.GEMINI_TEXT_MODEL ? [process.env.GEMINI_TEXT_MODEL] : []),
      "gemini-3-flash-preview",
      "gemini-flash-latest",
      "gemini-2.5-flash",
    ];

    const challengesText = challenges.join("、");

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
          console.warn(`[diagnose] diagnose model ${m} failed:`, msg.slice(0, 300));
        }
      }
      if (!diagnosis) throw lastErr || new Error("no model succeeded");
    } catch (error) {
      console.error("[diagnose] Diagnose generation error:", error);
      // code は「どのモデルがどのHTTPステータスで落ちたか」だけ。運用切り分け用で、機密は含まない。
      return json({ error: "診断の生成に失敗しました。時間をおいて再度お試しください。", code: attemptCodes.join(",") }, 500);
    }

    // リード保存（失敗しても診断結果は返す）
    let storeCode = "unknown";
    try {
      storeCode = await saveLead({
        email,
        name: name || null,
        company: company || null,
        industry: industry || null,
        business: business || null,
        employees: employees || null,
        challenges: challenges.length ? challenges : null,
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
        referer: request.headers.get("referer")?.slice(0, 500) || null,
        user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
      });
      console.log(`[diagnose] lead store result: ${storeCode}`);
    } catch (dbErr) {
      storeCode = "error_exception";
      console.error("[diagnose] Diagnose lead save failed (non-fatal):", dbErr);
    }

    // リード通知（失敗しても診断結果は返す）
    // 注意: resend.emails.send() は API エラーで throw せず { error } を返す。
    // 戻り値を必ず確認すること（見落とすと送信失敗を成功として記録してしまう）。
    let mailCode = "unknown";
    if (!process.env.RESEND_API_KEY) mailCode = "skipped_no_key";
    else try {
      const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "kokomu.matsuo@mgc-global01.com";
      const recipients = [receiverEmail];
      const { error: mailError } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.MAIL_FROM || "MGC AI診断 <onboarding@resend.dev>",
        replyTo: email,
        to: recipients,
        subject: oneLine(`[MGC AI診断リード] ${company || name || email}`),
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
      if (mailError) {
        mailCode = `error_${(mailError as any)?.statusCode || (mailError as any)?.name || "unknown"}`;
        console.error("[diagnose] Diagnose lead email rejected:", JSON.stringify(mailError).slice(0, 400));
      } else {
        mailCode = "sent";
        console.log(`[diagnose] lead emailed (model ${usedModel})`);
      }
    } catch (mailErr) {
      mailCode = "error_exception";
      console.error("[diagnose] Diagnose lead email failed (non-fatal):", mailErr);
    }

    return json({ diagnosis, storeCode, mailCode });
  },
};
