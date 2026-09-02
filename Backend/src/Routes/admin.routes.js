import express from "express";
import {
  adminLogin,
  AdminLogout,
  deleteMail,
  DeleteMails,
  GetMails,
  registerAdmin,
} from "../Controller/admin.controller.js";
import verifyToken from "../Middleware/verifyToken.js";
import validate from "../Middleware/validateBody.js";

const router = express.Router();

router.post("/admin-register", validate, registerAdmin);

router.post("/admin-login", validate, adminLogin);

router.post("/admin-logout", AdminLogout);

//Mails Get :
router.get("/get-mails", GetMails);

//Mails Delete :
router.delete(`/delete-mail/:id`, deleteMail);

//All Mails deleted :
router.delete(`/delete-mails`, DeleteMails);

router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token valid", admin: req.admin });
});
export default router;
