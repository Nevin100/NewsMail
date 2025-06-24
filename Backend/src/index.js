import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MailRoute from "./Routes/mail.Route.js";
import ConnectDB from "./Lib/db.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./Routes/admin.routes.js";
import verifyToken from "./Middleware/verifyToken.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import scrapeTechNews from "./Lib/scrape.js";
import generateNewsletterHTML from "./Lib/generateNewsletter.js";

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

app.get("/", async (req, res) => {
  res.send("Hello From the backend");
});

//AI Routes :
app.post("/admin/generate-newsletter", verifyToken, async (req, res) => {
  try {
    const articles = await scrapeTechNews();
    if (!articles.length)
      return res.status(404).json({ message: "No articles found." });

    const prompt = await generateNewsletterHTML(articles);

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const html = response.text();

    let HtMl = html
      .replace(/```html\s*/, "")
      .replace(/```$/, "")
      .trim();

    if (!HtMl) {
      return res.status(500).json({ error: "Empty response from Gemini" });
    }

    res.status(200).json({ success: true, HtMl });
  } catch (error) {
    console.error("Error during newsletter generation:", error); // <--
    res.status(500).json({ success: false, message: "Generation failed." });
  }
});

//Server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
  ConnectDB();
});
