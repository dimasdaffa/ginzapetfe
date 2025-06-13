import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

//Exporting the axios.isAxiosError function
export const isAxiosError = axios.isAxiosError;

export default apiClient;