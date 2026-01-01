import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants/index.js";
import { toast } from "react-toastify";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // будет "/api"
  timeout: 25000,
});

request.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => res,
  (err) => {
    toast.error("Произошла ошибка. Попробуйте снова.", { autoClose: 3000 });
    return Promise.reject(err);
  }
);

export default request;
