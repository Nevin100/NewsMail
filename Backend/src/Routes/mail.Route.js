import express from "express";
import { mailsLetter, CSVDownload } from "../Controller/mail.controller.js";

const router = express.Router();

//Mail Routes :
router.post("/mails-newsletter", mailsLetter);

//Excel-sheet
router.get("/export-csv", CSVDownload);

export default router;
