import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendNewsLetter = async (to, subject, html, bcc = []) => {
  return resend.emails.send({
    from: "NewsMail <onboarding@resend.dev>", 
    to: to ? [to] : undefined,
    bcc: bcc && bcc.length > 0 ? bcc : undefined,
    subject,
    html,
  });
};

export default sendNewsLetter;
