const Location = require("../models/Location");
// saveLocation
const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const location = await Location.create({
      user: req.user._id,
      latitude,
      longitude,
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// getLatestLocation
const getLatestLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveLocation,
  getLatestLocation,
};
