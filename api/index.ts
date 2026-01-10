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
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
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

// Export for Vercel
export default app;
