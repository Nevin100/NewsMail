import Mail from "../Model/mail.model.js";
import { Parser } from "json2csv";
import fs from "fs";

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
