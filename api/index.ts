import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
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

    try {
      const { error } = await resend.emails.send({
        from: "MGC Contact Form <onboarding@resend.dev>",
        replyTo: email,
        to: [receiverEmail],
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

      console.log(`[Backend] Email sent for ${name} → ${receiverEmail}`);
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

    try {
      const response = await (genAI as any).models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
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

// Export for Vercel
export default app;
