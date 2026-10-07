// const mongoose = require("mongoose");

// const contactSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//     },

//     telegramChatId: {
//       type: String,
//       required: true,
//     },

//     relation: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// module.exports = mongoose.model("Contact", contactSchema);

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    relation: {
      type: String,
      required: true,
    },

    // Telegram Chat ID automatic linking ke baad save hogi
    telegramChatId: {
      type: String,
      default: null,
    },

    // Telegram successfully connect hone ka time
    telegramLinkedAt: {
      type: Date,
      default: null,
    },

    // Temporary unique token for Telegram deep link
    telegramLinkToken: {
      type: String,
      default: null,
      index: true,
    },

    // Link expiry
    telegramLinkExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Contact", contactSchema);
