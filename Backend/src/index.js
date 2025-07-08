import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MailRoute from "./Routes/mail.Route.js";
import ArticleRoutes from "./Routes/article.routes.js";
import ConnectDB from "./Lib/db.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./Routes/admin.routes.js";
import verifyToken from "./Middleware/verifyToken.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import generateNewsletterHTML from "./Lib/generateNewsletter.js";

import sendNewsLetter from "./Lib/sendnewsLetter.js";
import NewsLetter from "./Model/newsLetter.model.js";
import Article from "./Model/article.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

//Routes :
app.use("/news-mail", MailRoute);
app.use("/admin", AdminRoutes);
app.use("/articles", ArticleRoutes);

app.get("/", async (req, res) => {
  res.send("Hello From the backend");
});

//AI Routes :
app.post("/admin/generate-newsletter", verifyToken, async (req, res) => {
  let lastGeneratedHtml = ""; // store globally in memory
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(5);

    if (!articles.length)
      return res
        .status(404)
        .json({ message: "No articles found.", error: true });

    const prompt = await generateNewsletterHTML(articles);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    let rawHtml = response.text();
    let cleanHtml = rawHtml.replace(/```html|```/g, "").trim();

    if (!cleanHtml) {
      return res
        .status(500)
        .json({ error: true, message: "Empty response from Gemini" });
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
  const { to, subject, html } = req.body;

  if (!to || !subject) {
    return res
      .status(400)
      .json({ message: "Missing fields: 'to' or 'subject'", error: true });
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

    const result = await sendNewsLetter(to, subject, htmlToSend);

    res
      .status(200)
      .json({ error: false, message: "Email sent successfully", data: result });
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
