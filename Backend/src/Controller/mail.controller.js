import Mail from "../Model/mail.model.js";
import { Parser } from "json2csv";
import sendNewsLetter from "../Lib/sendnewsLetter.js";

const welcomeTemplate = (name) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
    <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Welcome to NewsMailer, ${name}!</h1>
    </div>
    <div style="padding: 30px; color: #333; font-size: 16px; line-height: 1.5;">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We're thrilled to have you on board! 🚀</p>
      <p>With NewsMailer, you'll stay updated with the latest news and newsletters right in your inbox every 7 days.</p>
      <p>Here's what you can do next:</p>
      <ul style="color: #555;">
        <li>Explore exciting articles</li>
        <li>Subscribe to newsletters tailored for you</li>
        <li>Stay connected and never miss an update</li>
      </ul>
      <p>If you need help, feel free to <a href="mailto:nevinbali10@gmail.com" style="color: #4F46E5; text-decoration: none;">contact us</a>.</p>
      <p>Happy mailing! 🎉</p>
      <p>— The NewsMailer Team</p>
    </div>
    <div style="background: #f1f1f1; color: #888; text-align: center; padding: 15px; font-size: 14px;">
      <p>You are receiving this email because you signed up at NewsMailer.</p>
    </div>
  </div>
`;

export const mailsLetter = async (req, res) => {
  const { mail } = req.body;
  try {
    if (!mail) {
      return res
        .status(401)
        .json({ message: "Mail Field is empty", error: true });
    }

    const newMail = await Mail.findOne({ mail });
    if (newMail) {
      return res
        .status(401)
        .json({ message: "Mail Already registered", error: true });
    }

    const NewMail = new Mail({
      mail,
    });

    await NewMail.save();

    await sendNewsLetter(
      mail, // to
      "Welcome to NewsMailer 🎉",
      welcomeTemplate(mail)
    );

    res.status(200).json({
      message: "Mail registered successfully",
      error: false,
      data: NewMail,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Issue", error: true });
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
