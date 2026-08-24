const OVERPASS_APIS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

const fetchFromOverpass = async (api, query) => {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    console.log("Trying Overpass:", api);

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "SafeRideAI/1.0",
        Referer: "https://accident-detection-system-rwsz.vercel.app/",
      },

      body: new URLSearchParams({
        data: query,
      }).toString(),

      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Overpass API ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

const getNearbyHospitals = async (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return res.status(400).json({
      success: false,
      message: "Valid latitude and longitude are required",
    });
  }

  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:5000,${latitude},${longitude});
      way["amenity"="hospital"](around:5000,${latitude},${longitude});
      relation["amenity"="hospital"](around:5000,${latitude},${longitude});
    );
    out center;
  `;

  for (const api of OVERPASS_APIS) {
    try {
      const data = await fetchFromOverpass(api, query);

      console.log("Hospital data received from:", api);

      return res.status(200).json({
        success: true,
        hospitals: data.elements || [],
      });
    } catch (error) {
      console.error("Overpass failed:", api, error.message);
    }
  }

  return res.status(503).json({
    success: false,
    message: "Hospital service is temporarily unavailable",
  });
};

module.exports = {
  getNearbyHospitals,
};
