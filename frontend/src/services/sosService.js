import axios from "axios";

const API_URL = "http://localhost:5000/api/alerts";
// const API_URL = "http://192.168.1.8:5000/api/alerts";

export const sendSOS = async (location, nearestHospital) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/sos`,
    {
      latitude: location.latitude,
      longitude: location.longitude,

      hospitalName: nearestHospital.tags?.name || "Nearest Hospital",

      hospitalLatitude: nearestHospital.hospitalLatitude,

      hospitalLongitude: nearestHospital.hospitalLongitude,

      hospitalDistance: nearestHospital.distance,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getSOSHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
