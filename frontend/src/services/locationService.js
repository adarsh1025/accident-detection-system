import axios from "axios";

const API_URL = "http://localhost:5000/api/location";
// const API_URL = "http://192.168.1.8:5000/api/Location";

export const saveLocation = async (location) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getLocation = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
