const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const HazardTreatmentRelation = new Schema(
  {
    title: {
      type: Number,
      immutable: true,
    },
    riskRating: String,
    actionRequired: String,
    set: {
      type: Boolean,
      default: false,
    },
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
module.exports = mongoose.model(
  "HazardTreatmentRelation",
  HazardTreatmentRelation
);
