const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // Nearest Hospital Details
    hospitalName: {
      type: String,
      default: "",
    },

    hospitalLatitude: {
      type: Number,
      default: null,
    },

    hospitalLongitude: {
      type: Number,
      default: null,
    },

    hospitalDistance: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Alert", alertSchema);
