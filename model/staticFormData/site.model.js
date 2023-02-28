const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Site = new Schema(
  {
    siteName: String,
    streetNumber: String,
    streetAddress: String,
    suburb: String,
    postcode: String,
    stateId: {
      type: mongoose.Types.ObjectId,
      ref: "State",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Site", Site);
