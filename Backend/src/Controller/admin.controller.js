import Admin from "../Model/admin.model.js";
import generateToken from "../Lib/generateToken.js";
import Mail from "../Model/mail.model.js";
import bcrypt from "bcryptjs";
import {body,validationResult} from "express-validator";

// Temporary Controller : (Register Login - Later removed)
// export const registerAdmin = async(req, res) => {
//   try{
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors: errors.array()});
//     }

//     const {email, password} = req.body;
    
//     const salt = await bcrypt.genSalt(12);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     const newAdmin = new Admin({
//       email,
//       password: hashedPassword
//     });

//     await newAdmin.save();

//     res.status(201).json({message:"Admin created successfully", error: false, success: true});
//     return;
//   }catch(error){
//     res.status(500).json({message:"Internal Server Issue", error: true, success: false });
//     return;
//   }
// }

// Login Controller : 
export const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
     }
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(403)
        .json({ message: "Fields cant be empty", error: true });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input", error: true });
    }
    const emailModified = email.toLowerCase();
    const isAdmin = await Admin.findOne({ email: String(emailModified) });
    if (!isAdmin) {
      return res.status(403).json({ message: "No Admin matched" });
    }

    const isPasswordMatched = await bcrypt.compare(password, isAdmin.password);
    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ message: "Password Incorrect", error: true });
    }

    if (isPasswordMatched && isAdmin) {
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

export const GetMails = async (req, res) => {
  try {
    const mails = await Mail.find();
    if (!mails) {
      return res
        .status(403)
        .json({ message: "No mails retrived", error: true });
    }

    res.status(200).json({
      message: "All Mails retrieved Successfully",
      error: false,
      data: mails,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ messagte: "Internal Server Issue", error: true });
  }
};

export const deleteMail = async (req, res) => {
  try {
    const { id } = req.params;
    const mail = await Mail.findById(id);
    if (!mail) {
      return res.status(403).json({ message: "No Mail retrived", error: true });
    }

    await Mail.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Mail Deleted Successfully", error: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Issue", error: true });
  }
};

export const DeleteMails = async (req, res) => {
  try {
    const deletedMails = await Mail.deleteMany();
    if (!deletedMails) {
      return res.status(403).json({ message: "No Mails found", error: true });
    }

    res
      .status(200)
      .json({ message: "All Mails deleted Successfully", error: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Inbternal Server Issue", error: true });
  }
};

export const AdminLogout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Admin Logout Successful", error: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Issue", error: true });
  }
};