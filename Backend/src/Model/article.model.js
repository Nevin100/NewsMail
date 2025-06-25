// models/article.model.js
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    sourceUrl: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    summary: { type: String },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
