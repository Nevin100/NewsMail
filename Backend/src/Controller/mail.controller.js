import Mail from "../Model/mail.model.js";

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

    res
      .status(200)
      .json({
        message: "Mail registered successfully",
        error: false,
        data: NewMail,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Issue", error: true });
  }
};
