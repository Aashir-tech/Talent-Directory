import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

export const talentAPI = {
  // Get all talents or filter by skill
  getAllTalents: async (skillFilter = "") => {
    const url = skillFilter ? `/talents?skill=${skillFilter}` : "/talents";
    const response = await api.get(url);
    return response.data;
  },

  // Add a new talent
  addTalent: async (talentData) => {
    const response = await api.post("/talents", talentData);
    return response.data;
  },

  // Update talent
  updateTalent: async (id, talentData) => {
    const response = await api.put(`/talents/${id}`, talentData);
    return response.data;
  },

  // Get single talent by ID
  getTalentById: async (id) => {
    const response = await api.get(`/talents/${id}`);
    return response.data;
  },

  // Delete talent
  deleteTalent: async (id) => {
    const response = await api.delete(`/talents/${id}`);
    return response.data;
  },
};

export default api;
