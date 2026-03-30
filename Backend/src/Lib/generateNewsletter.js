const generateNewsletterHTML = async (articles) => {
  const prompt = `
You are an elite UI/UX designer and email marketing expert.

Your task is to create a **premium, modern, sexy, and visually stunning TECH NEWS newsletter** using **pure HTML with inline CSS only** (no external CSS, no JS).

The newsletter must feel:
- ✨ Clean
- 🚀 Slightly futuristic
- 💎 Premium & professional
- 😌 Easy on the eyes
- 📱 Perfectly responsive on mobile

This newsletter is called **NewsMail** and is created by **Nevin Bali**.  
This branding MUST be visible.

---

## 🧠 GLOBAL DESIGN VIBE

- Container width: **max-width: 600px**, centered
- Background: soft **tech-gradient** (examples: #f4faff → #e8f0fe, or subtle blue/purple gradient)
- Font-family: **Segoe UI, Helvetica, Arial, sans-serif**
- Rounded corners everywhere (cards, buttons)
- Subtle shadows for depth
- Smooth hover effects and soft transitions
- Looks premium on Gmail, Outlook, and mobile mail apps

---

## 🏷️ HEADER (VERY IMPORTANT)

At the top of the newsletter:
- Big bold title:  
  **📰 NewsMail**
- Subtitle (smaller, muted text):  
  *Curated tech updates you’ll love*
- Add a thin divider line below header
- Center aligned
- Clean, elegant spacing

---

## 📰 ARTICLE CARDS (FOR EACH ARTICLE)

Each article must be inside a **card-style block** with:

### Content:
- **Title**:
  - Bold
  - Dark color (#111 or black)
  - Slightly larger font
- **Summary**:
  - Softer gray color (#555)
  - Comfortable line height
- **Read More Button**:
  - Text: "Read More →"
  - Background: #007bff
  - Text color: white
  - Padding: 10px 22px
  - Border-radius: 6px
  - Display: inline-block
  - Hover effect:
    - Background becomes darker blue (#0056b3)
    - Slight scale-up or smooth transition
  - Opens in new tab:
    - target="_blank"
    - rel="noopener noreferrer"

### Card Styling:
- White background
- Border-radius: 12px
- Soft box-shadow
- Spacing between cards
- On hover: very subtle lift or shadow enhancement

---

## ✨ MICRO-ANIMATIONS (INLINE CSS ALLOWED)

Inside a <style> tag:
- Add a **fade-in + slide-up animation** for article cards on load
- Keep it subtle and classy (no aggressive motion)

---

## 📱 RESPONSIVENESS

- Mobile-first friendly
- Stack everything vertically
- Maintain padding and readability on small screens
- Buttons should remain tap-friendly

---

## 🔻 FOOTER (MANDATORY BRANDING)

At the bottom of the newsletter:

- Center aligned footer
- Light background or divider line on top
- Text (small, muted gray):
  
  **“NewsMail — Created with ❤️ by Nevin Bali”**

- Optional line below:
  *You’re receiving this because you love tech.*

This footer MUST be visible and elegant.

---

## 📥 INPUT DATA

Render the following articles using the above design.
Each article contains:
- title
- summary
- url

Here is the JSON data:

${JSON.stringify(articles, null, 2)}

---

### OUTPUT RULES (STRICT)
- Return ONLY clean HTML
- Use inline CSS and <style> tag if needed
- NO markdown
- NO explanations
- NO code fences
- NO extra text outside HTML
`;

  return prompt;
};

export default generateNewsletterHTML;
