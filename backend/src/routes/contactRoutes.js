// const express = require("express");
// const router = express.Router();

// const {
//   addContact,
//   getContacts,
//   updateContact,
//   deleteContact,
// } = require("../controllers/contactController");
// const { protect } = require("../middleware/authMiddleware");

// router.post("/", protect, addContact);
// router.get("/", protect, getContacts);
// router.put("/:id", protect, updateContact);
// router.delete("/:id", protect, deleteContact);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  generateTelegramLink,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addContact);
router.get("/", protect, getContacts);

router.post("/:id/telegram-link", protect, generateTelegramLink);

router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
