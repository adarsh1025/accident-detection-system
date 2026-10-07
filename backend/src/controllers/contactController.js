// const Contact = require("../models/Contact");
// // addContact
// const addContact = async (req, res) => {
//   try {
//     const { name, phone, telegramChatId, relation } = req.body;

//     const contact = await Contact.create({
//       user: req.user._id,
//       name,
//       phone,
//       telegramChatId,
//       relation,
//     });

//     res.status(201).json(contact);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// // getContacts
// const getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find({
//       user: req.user._id,
//     });

//     res.status(200).json(contacts);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// // updateContact
// const updateContact = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);

//     if (!contact) {
//       return res.status(404).json({
//         message: "Contact not found",
//       });
//     }

//     if (contact.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({
//         message: "Not Authorized",
//       });
//     }

//     const updatedContact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         returnDocument: "after",
//       },
//     );

//     res.status(200).json(updatedContact);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// // deleteContact
// const deleteContact = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);

//     if (!contact) {
//       return res.status(404).json({
//         message: "Contact not found",
//       });
//     }

//     if (contact.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({
//         message: "Not Authorized",
//       });
//     }

//     await contact.deleteOne();

//     res.status(200).json({
//       message: "Contact deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   addContact,
//   getContacts,
//   updateContact,
//   deleteContact,
// };

const crypto = require("crypto");
const Contact = require("../models/Contact");

// Add Contact
const addContact = async (req, res) => {
  try {
    const { name, phone, telegramChatId, relation } = req.body;

    const contact = await Contact.create({
      user: req.user._id,
      name,
      phone,
      relation,
      telegramChatId: telegramChatId || null,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      user: req.user._id,
    });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Contact
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    const { name, phone, relation, telegramChatId } = req.body;

    if (name !== undefined) contact.name = name;
    if (phone !== undefined) contact.phone = phone;
    if (relation !== undefined) contact.relation = relation;

    // Manual Chat ID ko backward compatibility ke liye allow kar rahe hain
    if (telegramChatId !== undefined) {
      contact.telegramChatId = telegramChatId || null;
    }

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Generate Telegram Connect Link
const generateTelegramLink = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    if (!process.env.TELEGRAM_BOT_USERNAME) {
      return res.status(500).json({
        message: "Telegram bot username is not configured",
      });
    }

    // Secure random token
    const token = crypto.randomBytes(24).toString("base64url");

    // Link valid for 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    contact.telegramLinkToken = token;
    contact.telegramLinkExpiresAt = expiresAt;

    await contact.save();

    const botUsername = process.env.TELEGRAM_BOT_USERNAME.replace(/^@/, "");

    const telegramUrl = `https://t.me/${botUsername}?start=${token}`;

    res.status(200).json({
      success: true,
      message: "Telegram connection link generated",
      telegramUrl,
      expiresAt,
    });
  } catch (error) {
    console.error("Generate Telegram Link Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  generateTelegramLink,
};
