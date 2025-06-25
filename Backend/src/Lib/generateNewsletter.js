// generateNewsletter.js
const generateNewsletterHTML = async (articles) => {
  const prompt = `
You are a professional newsletter editor. Generate a clean, responsive tech newsletter in HTML with inline CSS only (no external CSS). The design should be mobile-friendly and visually appealing.

### Design Guidelines:
- Use a main container with max-width: 600px, centered horizontally.
- Use a clean sans-serif font like Arial or Helvetica.
- Each article must have:
  - A bold, black heading/title (h2 or strong)
  - A summary/description below the title in a slightly smaller, gray font
  - A "Read More" button below the summary
- The "Read More" button styling:
  - Background color: #007bff (blue)
  - White text
  - Border-radius: 5px
  - Padding: about 10px 20px
  - Inline-block display
  - The link should open in a new tab (use target="_blank" and rel="noopener noreferrer")
- The entire newsletter should be responsive and look good on both desktop and mobile
- Use semantic HTML elements as much as possible
- All links must use correct href attributes from the article data

### Articles JSON:
You will receive the articles data in this JSON format. Each article has:
- title
- summary (or description)
- url (link to the full article)

Generate a complete HTML snippet containing all the articles styled as per above.

Here is the data:

${JSON.stringify(articles, null, 2)}
`;

  return prompt;
};

export default generateNewsletterHTML;
