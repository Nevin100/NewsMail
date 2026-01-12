import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MailRoute from "./Routes/mail.Route.js";
import ArticleRoutes from "./Routes/article.routes.js";
import ConnectDB from "./Lib/db.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./Routes/admin.routes.js";
import verifyToken from "./Middleware/verifyToken.js";
import generateNewsletterHTML from "./Lib/generateNewsletter.js";
import sendNewsLetter from "./Lib/sendnewsLetter.js";
import NewsLetter from "./Model/newsLetter.model.js";
import Article from "./Model/article.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";


app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://news-mail.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

const callGroqForHTML = async (prompt) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert email marketer. Return ONLY clean, valid HTML. No markdown, no explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 2000,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq error:", err);
    throw new Error("Groq API failed");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

//Routes :
app.use("/news-mail", MailRoute);
app.use("/admin", AdminRoutes);
app.use("/articles", ArticleRoutes);

app.get("/", async (req, res) => {
  res.send("Hello From the backend");
});

//AI Routes :
app.post("/admin/generate-newsletter", async (req, res) => {
  let lastGeneratedHtml = "";
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(5);

    if (!articles.length) {
      return res
        .status(404)
        .json({ message: "No articles found.", error: true });
    }

    const prompt = await generateNewsletterHTML(articles);

    const rawHtml = await callGroqForHTML(prompt);

    const cleanHtml = rawHtml
      .replace(/```html|```/gi, "")
      .trim();

    if (!cleanHtml) {
      return res
        .status(500)
        .json({ error: true, message: "Empty response from AI" });
    }

    const saved = await NewsLetter.create({ html: cleanHtml });
    lastGeneratedHtml = cleanHtml;

    res.status(200).json({
      message: "Generated and saved successfully",
      success: true,
      data: saved,
      html: lastGeneratedHtml,
    });
  } catch (error) {
    console.error("Error during newsletter generation:", error);
    res.status(500).json({ success: false, message: "Generation failed." });
  }
});

//NewsLetter Route :
app.post("/admin/send-newsletter", verifyToken, async (req, res) => {
  const { to, bcc, subject, html } = req.body;

  if ((!to && (!bcc || bcc.length === 0)) || !subject) {
    return res.status(400).json({
      message: "Missing fields: Provide either 'to' or 'bcc' and 'subject'",
      error: true,
    });
  }

  try {
    const htmlToSend =
      html ||
      (await NewsLetter.findOne()
        .sort({ createdAt: -1 })
        .then((doc) => doc?.html));

    if (!htmlToSend) {
      return res
        .status(400)
        .json({ message: "No newsletter HTML found to send", error: true });
    }

    const result = await sendNewsLetter(to, subject, htmlToSend, bcc);

    res.status(200).json({
      error: false,
      message: "Email sent successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error sending newsletter:", err);
    res.status(500).json({ error: true, message: "Failed to send email" });
  }
});

//Server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
  ConnectDB();
});
