const OVERPASS_API = "https://overpass-api.de/api/interpreter";

const getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        data: query,
      }),
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      hospitals: data.elements,
    });
  } catch (error) {
    console.error("Nearby Hospital Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby hospitals",
    });
  }
};

module.exports = {
  getNearbyHospitals,
};
