const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const State = new Schema(
  {
    title: {
      type: String,
      // enum: ["NSW", "ACT", "QLD", "NT", "SA", "TAS", "NZ", "VTC", "WA"],
    },
    jurisdictionId: {
      type: mongoose.Types.ObjectId,
      ref: "Jurisdiction",
    },
    safetyLegislationId: {
      type: mongoose.Types.ObjectId,
      ref: "SafetyLegislation",
    },
    regulatorId: {
      type: mongoose.Types.ObjectId,
      ref: "Regulator",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    set: {
      type: Boolean,
      default: "false",
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
module.exports = mongoose.model("State", State);
