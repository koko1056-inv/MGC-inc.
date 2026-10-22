// 問い合わせフォームの送信先（POST /api/contact）。内容を Resend で代表宛てにメールする。
import { Resend } from 'resend';
import { json, readJson, rateLimited, clientIp, str, isEmail, escapeHtml, oneLine, isBot } from './_lib/guard.js';

export default {
  async fetch(request: Request): Promise<Response> {
    const parsed = await readJson(request);
    if ('error' in parsed) return parsed.error;
    const { body } = parsed;

    // ボットには成功を装う（送信はしない）
    if (isBot(body)) return json({ success: true, message: 'Message sent successfully.' });

    // 同じ送信元から10分に5件まで
    if (rateLimited(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
      return json({ success: false, message: 'Too many requests. Please try again later.' }, 429);
    }

    const name = str(body.name, 100);
    const email = str(body.email, 254);
    const message = str(body.message, 5000);
    if (!name || !message || !isEmail(email)) {
      return json({ success: false, message: 'All fields are required.' }, 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[contact] RESEND_API_KEY is not set');
      return json({ success: false, message: 'Failed to send email.' }, 500);
    }
    const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'kokomu.matsuo@mgc-global01.com';

    try {
      const { error } = await new Resend(apiKey).emails.send({
        from: 'MGC Contact Form <onboarding@resend.dev>',
        replyTo: email,
        to: [receiver],
        subject: oneLine(`[MGC Contact] New message from ${name}`),
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        // 入力値はすべてエスケープしてから埋め込む（メール内でのHTML挿入を防ぐ）
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D6CDF;">[MGC Contact] New message from ${escapeHtml(name)}</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <hr style="border: 1px solid #e5e7eb;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>`,
      });
      if (error) {
        // 個人情報（氏名・メール）はログに残さない
        console.error('[contact] Resend error:', (error as { name?: string }).name ?? 'unknown');
        return json({ success: false, message: 'Failed to send email.' }, 500);
      }
      return json({ success: true, message: 'Message sent successfully.' });
    } catch (e) {
      console.error('[contact] send failed:', String((e as Error)?.message ?? e).slice(0, 200));
      return json({ success: false, message: 'Internal server error while sending email.' }, 500);
    }
  },
};
