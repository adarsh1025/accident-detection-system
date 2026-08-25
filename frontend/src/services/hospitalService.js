const API_URL = import.meta.env.VITE_API_URL;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getNearbyHospitals = async (latitude, longitude) => {
  const url =
    `${API_URL}/api/hospitals/nearby` +
    `?latitude=${latitude}&longitude=${longitude}`;

  let lastError;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`Hospital API attempt ${attempt}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.message ||
            `Hospital API failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      return Array.isArray(data.hospitals) ? data.hospitals : [];
    } catch (error) {
      console.error(`Hospital API attempt ${attempt} failed:`, error);

      lastError = error;

      if (attempt < 2) {
        await wait(1000);
      }
    }
  }

  throw lastError;
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
