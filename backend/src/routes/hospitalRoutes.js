const express = require("express");
const router = express.Router();

const { getNearbyHospitals } = require("../controllers/hospitalController");

router.get("/nearby", getNearbyHospitals);

module.exports = router;
