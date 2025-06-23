import jwt from "jsonwebtoken";
import Admin from "../Model/admin.model.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(403)
        .json({ message: "No Token Reccieved ", error: true });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized Invalid Token Recieved" });
    }

    const admin = await Admin.findById(decoded.userId).select("-password");
    if (!admin) {
      return res
        .status(403)
        .json({ message: "No Admin Credentials Matched", error: true });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Middleware Issue", error: true });
  }
};

export default verifyToken;
