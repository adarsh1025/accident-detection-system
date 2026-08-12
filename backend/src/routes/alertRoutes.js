// const express = require("express");
// const router = express.Router();

// const { triggerSOS } = require("../controllers/alertController");
// const { protect } = require("../middleware/authMiddleware");

// router.post("/sos", protect, triggerSOS);

// module.exports = router;

const express = require("express");
const router = express.Router();

const { triggerSOS, getSOSHistory } = require("../controllers/alertController");

const { protect } = require("../middleware/authMiddleware");

// Create SOS Alert
router.post("/sos", protect, triggerSOS);

// Get SOS History
router.get("/", protect, getSOSHistory);

module.exports = router;
