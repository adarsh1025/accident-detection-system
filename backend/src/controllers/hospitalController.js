const OVERPASS_APIS = [
  "https://overpass.private.coffee/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
];

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
      [out:json][timeout:20];
      (
        node["amenity"="hospital"](around:3000,${latitude},${longitude});
        way["amenity"="hospital"](around:3000,${latitude},${longitude});
        relation["amenity"="hospital"](around:3000,${latitude},${longitude});
      );
      out center;
    `;

    let lastError = null;

    for (const api of OVERPASS_APIS) {
      try {
        console.log(`Trying Overpass API: ${api}`);

        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 25000);

        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            "User-Agent": "SafeRideAI/1.0",
          },
          body: new URLSearchParams({
            data: query,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text();

          console.error(
            `Overpass API ${response.status} from ${api}:`,
            errorText.substring(0, 500),
          );

          lastError = new Error(`Overpass API error: ${response.status}`);

          continue;
        }

        const data = await response.json();

        console.log(`Hospital data received from: ${api}`);

        return res.status(200).json({
          success: true,
          hospitals: data.elements,
        });
      } catch (error) {
        console.error(`Overpass request failed for ${api}:`, error.message);

        lastError = error;
      }
    }

    throw lastError || new Error("All Overpass APIs failed");
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
