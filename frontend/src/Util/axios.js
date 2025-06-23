import { BASEURL } from "./BaseUrl.js";
import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: BASEURL,
});

export default instance;
