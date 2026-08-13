const API_URL = import.meta.env.VITE_API_URL;

export const getNearbyHospitals = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${API_URL}/api/hospitals/nearby?latitude=${latitude}&longitude=${longitude}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch nearby hospitals");
    }

    const data = await response.json();

    return data.hospitals;
  } catch (error) {
    console.error("Nearby Hospital Error:", error);
    throw error;
  }
};

// Calculate distance between two locations
export const calculateDistance = (
  userLatitude,
  userLongitude,
  hospitalLatitude,
  hospitalLongitude,
) => {
  const R = 6371;

  const dLat = ((hospitalLatitude - userLatitude) * Math.PI) / 180;
  const dLon = ((hospitalLongitude - userLongitude) * Math.PI) / 180;

  const lat1 = (userLatitude * Math.PI) / 180;
  const lat2 = (hospitalLatitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
