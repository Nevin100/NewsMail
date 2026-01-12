import Mail from "../Model/mail.model.js";
import { Parser } from "json2csv";
import {sendNewsLetter} from "../index.js";

const welcomeTemplate = (email) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f4f7fb;">
    <div style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 20px 40px rgba(0,0,0,0.08);
      font-family:'Segoe UI', Helvetica, Arial, sans-serif;
    ">

      <!-- HEADER -->
      <div style="
        background:linear-gradient(135deg,#4f46e5,#6366f1);
        padding:32px 24px;
        text-align:center;
        color:#ffffff;
      ">
        <h1 style="margin:0; font-size:30px; font-weight:700;">
          Welcome to <span style="color:#fde68a;">NewsMail</span> 🚀
        </h1>
        <p style="margin-top:10px; font-size:15px; opacity:0.9;">
          Curated tech updates. Delivered with style.
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:36px 30px; color:#1f2937;">
        <p style="font-size:16px; margin-top:0;">
          Hey <strong>${email}</strong>,
        </p>

        <p style="font-size:16px; line-height:1.7;">
          You’re officially in 🎉  
          Welcome to <strong>NewsMail</strong> — a premium newsletter where
          <strong>AI, tech breakthroughs, startups, and dev tools</strong>
          land straight in your inbox.
        </p>

        <!-- FEATURE BOX -->
        <div style="
          margin:28px 0;
          padding:22px;
          border-radius:12px;
          background:#f8fafc;
          border:1px solid #e5e7eb;
        ">
          <h3 style="margin-top:0; font-size:18px;">
            ✨ What you’ll get
          </h3>
          <ul style="padding-left:18px; margin:12px 0; color:#374151;">
            <li>Weekly AI & tech news summaries</li>
            <li>Hand-picked articles & tools</li>
            <li>Zero spam. Only value.</li>
          </ul>
        </div>

        <!-- CTA -->
        <div style="text-align:center; margin:36px 0;">
          <a href="https://news-mail.vercel.app"
            style="
              display:inline-block;
              padding:14px 28px;
              background:#4f46e5;
              color:#ffffff;
              text-decoration:none;
              border-radius:10px;
              font-size:16px;
              font-weight:600;
              box-shadow:0 10px 20px rgba(79,70,229,0.35);
            ">
            Explore NewsMail →
          </a>
        </div>

        <p style="font-size:15px; color:#374151; line-height:1.6;">
          If you ever have feedback, ideas, or just want to say hi —  
          reach out at
          <a href="mailto:nevinbali10@gmail.com"
             style="color:#4f46e5; text-decoration:none; font-weight:500;">
            nevinbali10@gmail.com
          </a>
        </p>

        <p style="margin-top:30px; font-size:15px;">
          Stay curious, <br />
          <strong>— Nevin Bali</strong> ✨
        </p>
      </div>

      <!-- FOOTER -->
      <div style="
        background:#f1f5f9;
        padding:18px;
        text-align:center;
        font-size:13px;
        color:#64748b;
      ">
        <p style="margin:0;">
          You received this email because you subscribed to <strong>NewsMail</strong>.
        </p>
        <p style="margin:6px 0 0;">
          © ${new Date().getFullYear()} NewsMail · Created with ❤️ by Nevin Bali
        </p>
      </div>

    </div>
  </body>
</html>
`;

export const mailsLetter = async (req, res) => {
  const { mail } = req.body;

  try {
    if (!mail) {
      return res.status(400).json({
        message: "Mail field is empty",
        error: true,
      });
    }

    const existingMail = await Mail.findOne({ mail });
    if (existingMail) {
      return res.status(409).json({
        message: "Mail already subscribed",
        error: true,
      });
    }

    const newMail = await Mail.create({ mail });

    sendNewsLetter(
      mail,
      "Welcome to NewsMailer 🎉",
      welcomeTemplate(mail)
    ).catch(console.error);

    res.status(200).json({
      message: "Mail registered successfully",
      error: false,
      data: newMail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: true,
    });
  }
};


export const CSVDownload = async (req, res) => {
  try {
    const data = await Mail.find().lean();
    const fields = Object.keys(data[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    return res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error exporting data");
  }
};
