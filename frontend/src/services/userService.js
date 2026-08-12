import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
// const API_URL = "http://192.168.1.8:5000/api/auth";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
