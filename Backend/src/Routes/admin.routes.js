import express from "express";
import { adminLogin, adminDashboard } from "../Controller/admin.controller.js";
import verifyToken from "../Middleware/verifyToken.js";

const router = express.Router();

router.post("/admin-login", adminLogin);

router.get("/dashboard", verifyToken, adminDashboard);

router.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token valid", admin: req.admin });
});
export default router;
