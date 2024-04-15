import axios from "axios";
const BASE_URL = "https://zest1-db55533a38ba.herokuapp.com/";
//"https://zest1-db55533a38ba.herokuapp.com/";
//"http://localhost:3500";

export const api = axios.create({
  baseURL: BASE_URL,
});
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
