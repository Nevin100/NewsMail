const generateNewsletterHTML = async (articles) => {
  const prompt = `
You are a professional tech newsletter designer. Create a **modern, responsive, and visually appealing HTML newsletter** using inline CSS (no external CSS or JavaScript).

### GOAL:
Create an engaging TECH NEWS newsletter that looks stunning on **both desktop and mobile**. Use a pleasant background color, stylish color palette, and smooth transitions/animations where possible (using inline CSS only). The vibe should be **clean, slightly futuristic, and sexy**.

---

### 🔧 DESIGN RULES:

- Use a main container with **max-width: 600px**, center-aligned.
- Add subtle **box shadows** and **rounded corners** to cards.
- Use a **light-to-dark gradient background** or soft tech-themed colors like #f4faff or #e8f0fe.
- Font: Use clean sans-serif like Helvetica, Segoe UI, or Arial.
- Add slight fade-in or slide-up **animation on load** using @keyframes and inline ;
  "<style>" tags (yes, you can do this with inline ;
  "</style>").

---

### 📚 Each Article Block Must Have:

- A **bold, black heading/title** (<h2> or <strong>)
- A **summary/description** in a slightly smaller **gray font** (#555)
- A **Read More button** with:
  - Background: #007bff (blue)
  - Text: white color
  - Rounded corners: 5px
  - Padding: 10px 20px
  - Display: inline-block
  - Open link in **new tab** with target=_blank and rel=noopener noreferrer
- Add a **hover effect** to the button: darker blue background on hover

---

### 🎨 Overall Aesthetic:

- Use soft, calming **background gradients** or pastel backgrounds.
- Add spacing between sections for readability.
- Use **hover effects** and **transitions** for buttons or article blocks.
- Make layout fully responsive: stack articles vertically on mobile, preserve padding.

---

### 📥 INPUT DATA:

Render the following articles as described above. Each article has:
- 'title'
- 'summary'
- 'url'

Here is the JSON data:

${JSON.stringify(articles, null, 2)}

---

Please return only a clean, complete HTML snippet with proper inline CSS, no extra explanation or code fencing.
`;

  return prompt;
};

export default generateNewsletterHTML;
