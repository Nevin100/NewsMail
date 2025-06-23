import Admin from "../Model/admin.model.js";
import generateToken from "../Lib/generateToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(403)
        .json({ message: "Fields cant be empty", error: true });
    }

    const isAdmin = await Admin.findOne({ email: email });
    if (!isAdmin) {
      return res.status(403).json({ message: "No Admin matched" });
    }

    const isPassword = isAdmin.password == password;
    if (!isPassword) {
      return res
        .status(400)
        .json({ message: "Password Incorrect", error: true });
    }

    if (isPassword && isAdmin) {
      const token = generateToken(isAdmin._id, res);

      res.status(200).json({
        message: "Admin Login SUccessfull",
        error: false,
        token: token,
        data: isAdmin,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server issue", error: true });
  }
};

export const adminDashboard = async (req, res) => {
  try {
    res.send("<h1>Hello from the Dashboard</h1>");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Issue", error: true });
  }
};
