import express from "express";
import { mailsLetter } from "../Controller/mail.controller.js";

const router = express.Router();

//Mail Routes :
router.post("/mails-newsletter", mailsLetter);

export default router;
