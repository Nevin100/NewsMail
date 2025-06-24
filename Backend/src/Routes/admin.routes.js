import express from "express";
import {
  adminLogin,
  AdminLogout,
  deleteMail,
  GetMails,
} from "../Controller/admin.controller.js";
import verifyToken from "../Middleware/verifyToken.js";

const router = express.Router();

router.post("/admin-login", adminLogin);

router.post("/admin-logout", AdminLogout);

//Mails Get :
router.get("/get-mails", GetMails);

//Mails Delete :
router.delete(`/delete-mail/:id`, deleteMail);

router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token valid", admin: req.admin });
});
export default router;
