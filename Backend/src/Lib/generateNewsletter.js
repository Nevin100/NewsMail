const generateNewsletterHTML = async (articles) => {
  return `
You are a newsletter generator. Convert the following tech news JSON into a clean, responsive HTML newsletter.

Use a professional but modern style. Wrap each article with a heading (h2), short summary (p), and a "Read more" button linking to the original article.

JSON:
${JSON.stringify(articles, null, 2)}`;
};

export default generateNewsletterHTML;
