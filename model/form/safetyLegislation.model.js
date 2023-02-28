const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SafetyLegislation = new Schema(
  {
    act: String,
    regulation: String,
    status: {
      type: String,
      default: "active",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SafetyLegislation", SafetyLegislation);
