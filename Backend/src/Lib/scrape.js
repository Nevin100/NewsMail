import axios from "axios";
import * as cheerio from "cheerio";

const scrapeTechNews = async (siteUrl) => {
  try {
    const base = new URL(siteUrl);
    const rssVariants = [
      `${base.origin}/feed`,
      `${base.origin}/rss`,
      `${base.origin}/feed.xml`,
      `${base.origin}/rss.xml`,
      siteUrl,
    ];

    let data = null;
    let isRSS = false;

    for (const feedUrl of rssVariants) {
      try {
        const res = await axios.get(feedUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 10000,
        });
        data = res.data;
        isRSS = feedUrl !== siteUrl;
        break;
      } catch {
        continue;
      }
    }

    if (!data) return [];

    const $ = cheerio.load(data, { xmlMode: isRSS });
    const articles = [];

    if (isRSS) {
      $("item, entry").each((i, el) => {
        const title = $(el).find("title").first().text().trim();
        const link =
          $(el).find("link").first().text().trim() ||
          $(el).find("link").first().attr("href");
        const summary =
          $(el).find("description, summary, content").first().text().trim() ||
          "No summary available.";

        if (title && link) {
          articles.push({
            title,
            link: link.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
            summary: summary
              .replace(/<[^>]*>/g, "")
              .slice(0, 200)
              .trim(),
            sourceUrl: siteUrl,
          });
        }
      });
    }

    return articles.slice(0, 5);
  } catch (error) {
    console.error("Scraping failed:", error.message);
    return [];
  }
};

export default scrapeTechNews;
