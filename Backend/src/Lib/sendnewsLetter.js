import nodemailer from "nodemailer";

const sendNewsLetter = async (to, subject, html, bcc = []) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Your Personal NewsLetter from " <test20000000@email.com>',
      to: to || undefined,
      bcc: bcc.length > 0 ? bcc : undefined,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendNewsLetter;
