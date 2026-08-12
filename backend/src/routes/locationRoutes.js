const express = require("express");
const router = express.Router();

const { saveLocation,getLatestLocation } = require("../controllers/locationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, saveLocation);
router.get("/", protect, getLatestLocation);

module.exports = router;