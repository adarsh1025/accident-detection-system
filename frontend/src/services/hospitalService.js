const OVERPASS_API = "https://overpass-api.de/api/interpreter";

export const getNearbyHospitals = async (latitude, longitude) => {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${latitude},${longitude});
      way["amenity"="hospital"](around:5000,${latitude},${longitude});
      relation["amenity"="hospital"](around:5000,${latitude},${longitude});
    );
    out center;
  `;

  const response = await fetch(OVERPASS_API, {
    method: "POST",
    body: query,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch nearby hospitals");
  }

  const data = await response.json();

  return data.elements;
};

// Calculate distance between two locations
export const calculateDistance = (
  userLatitude,
  userLongitude,
  hospitalLatitude,
  hospitalLongitude,
) => {
  const R = 6371; // Earth radius in kilometers

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
