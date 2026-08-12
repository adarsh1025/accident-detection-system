const Alert = require("../models/Alert");
const Location = require("../models/Location");
const User = require("../models/User");
const sendTelegramAlert = require("../utils/telegram");
const Contact = require("../models/Contact");

const triggerSOS = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      hospitalName,
      hospitalLatitude,
      hospitalLongitude,
      hospitalDistance,
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const user = await User.findById(req.user._id);
    const contacts = await Contact.find({
      user: req.user._id,
    });

    const alert = await Alert.create({
      user: req.user._id,
      latitude,
      longitude,

      hospitalName,
      hospitalLatitude,
      hospitalLongitude,
      hospitalDistance,
    });
    const message = `
🚨 EMERGENCY ALERT 🚨

👤 Name: ${user.name}

📍 Accident/User Location:
https://maps.google.com/?q=${latitude},${longitude}

🏥 Nearest Hospital:
${hospitalName}

📏 Distance:
${hospitalDistance.toFixed(2)} km

🗺 Hospital Location:
https://www.google.com/maps/search/?api=1&query=${hospitalLatitude},${hospitalLongitude}

⚠️ ${user.name} may need immediate assistance.

Please contact immediately.
`;

    for (const contact of contacts) {
      // console.log("Contact Name:", contact.name);
      // console.log("Chat ID:", contact.telegramChatId);
      if (contact.telegramChatId) {
        await sendTelegramAlert(contact.telegramChatId, message);
      }
    }

    res.status(201).json({
      message: "SOS Alert Created Successfully",
      alert,
    });
  } catch (error) {
    console.error("SOS ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
// getSOSHistory
const getSOSHistory = async (req, res) => {
  try {
    const alerts = await Alert.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  triggerSOS,
  getSOSHistory,
};
