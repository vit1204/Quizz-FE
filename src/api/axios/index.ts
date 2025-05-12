import axios from "axios";

const BE_URL = import.meta.env.VITE_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function $get(url: string, config = {}) {
  const response = await axiosInstance.get(url, config);
  return response.data;
}

async function $post(url: string, config = {}) {
  const response = await axiosInstance.post(url, config);
  return response.data;
}

export { $get, $post };
