import axios from "axios";
import * as cheerio from "cheerio";

const scrapeTechNews = async () => {
  try {
    const { data } = await axios.get("https://www.techradar.com/news");
    const $ = cheerio.load(data);
    const articles = [];

    $(".listingResult.small").each((i, el) => {
      const title = $(el).find(".article-name").text().trim();
      const link = $(el).find("a").attr("href");
      const summary = $(el).find(".synopsis").text().trim();

      if (title && link) {
        articles.push({ title, link, summary });
      }
    });

    return articles.slice(0, 5);
  } catch (error) {
    console.error("Scraping failed:", error.message);
    return [];
  }
};

export default scrapeTechNews;
