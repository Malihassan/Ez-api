const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const RiskLevel = new Schema(
  {
    title: String,
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
module.exports = mongoose.model("RiskLevel", RiskLevel);
