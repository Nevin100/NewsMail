// models/newsletter.model.js
import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    html: { type: String, required: true },
  },
  { timestamps: true }
);
const NewsLetter = mongoose.model("Newsletter", newsletterSchema);

export default NewsLetter;
