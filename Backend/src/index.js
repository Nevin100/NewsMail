import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MailRoute from "./Routes/mail.Route.js";
import ConnectDB from "./Lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

//Routes :
app.use("/tensorBoy", MailRoute);

//Server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
  ConnectDB();
});
