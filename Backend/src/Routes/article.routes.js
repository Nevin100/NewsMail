// routes/article.routes.js
import express from "express";
import scrapeTechNews from "../Lib/scrape.js";
import Article from "../Model/article.model.js";

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

export default router;
