import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: true,
  },
});

const Mail = mongoose.model("Mail", mailSchema);

export default Mail;
