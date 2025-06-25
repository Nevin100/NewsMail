import axios from "axios";
import * as cheerio from "cheerio";

const scrapeTechNews = async (siteUrl) => {
  try {
    const { data } = await axios.get(siteUrl);
    const $ = cheerio.load(data);
    const articles = [];

    $(".listingResult.small").each((i, el) => {
      const title = $(el).find(".article-name").text().trim();
      const link = $(el).find("a").attr("href");
      const summary =
        $(el).find(".synopsis").text().trim() || "No summary available.";

      if (title && link) {
        articles.push({ title, link, summary, sourceUrl: siteUrl });
      }
    });

    return articles.slice(0, 5);
  } catch (error) {
    console.error("Scraping failed:", error.message);
    return [];
  }
};

export default scrapeTechNews;
