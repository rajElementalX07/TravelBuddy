import axios from "axios";


const BASE_URL = "https://travelbuddy-ynh6.onrender.com"
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;