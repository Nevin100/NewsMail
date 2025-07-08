// routes/article.routes.js
import express from "express";
import scrapeTechNews from "../Lib/scrape.js";
import Article from "../Model/article.model.js";
import NewsLetter from "../Model/newsLetter.model.js";

const router = express.Router();

router.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url)
    return res.status(400).json({ error: true, message: "URL is required" });

  try {
    const articles = await scrapeTechNews(url);

    if (!articles.length)
      return res
        .status(404)
        .json({ error: true, message: "No articles found" });

    const saved = await Article.insertMany(articles);
    if (!saved) {
      return res.status(401).json({ error: true, nmessage: "Not Saved In Db" });
    }
    res.status(200).json({
      success: true,
      message: "Scraped and saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Scrape+Save Error:", err.message);
    res.status(500).json({ error: true, message: "Scrape failed" });
  }
});

router.get("/total-articles", async (req, res) => {
  try {
    const articles = await Article.find();
    if (!articles) {
      return res
        .status(400)
        .json({ message: "No Articles found", error: true });
    }
    res
      .status(200)
      .json({ message: "Articles recieved", data: articles, error: false });
  } catch (error) {
    console.error("Error Occured:", err.message);
    res.status(500).json({ error: true, message: "internal Server Issue" });
  }
});

// newsletter :
router.get("/total-newsletter-formats", async (req, res) => {
  try {
    const newsLetters = await NewsLetter.find();
    if (!newsLetters) {
      return res
        .status(400)
        .json({ message: "No NewsLetters found", error: true });
    }
    res
      .status(200)
      .json({
        message: "Newsletters recieved",
        data: newsLetters,
        error: false,
      });
  } catch (error) {
    console.error("Error Occured:", error.message);
    res.status(500).json({ error: true, message: "internal Server Issue" });
  }
});
export default router;
