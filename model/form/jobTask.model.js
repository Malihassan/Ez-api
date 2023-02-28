const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const JOBTask = new Schema(
  {
    title: String,
    PPE: Array,
    risk: Array,
    licence: Array,
    codeOfPractice: Array,
    identifyHazard: Array,
    controlActionRequired: Array,
    allContrlActReqTitle: Array,
    allHazardsTitle: Array,
    allCOPTitle: Array,
    staffTitle: Array,
    staff: Array,
    tradeCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "TradeCategory",
    },
    chemical: {
      type: String,
      enum: ["YES", "NO"],
      default: "NO",
    },
    riskLevel: {
      type: String,
      default: " ",
    },
    residualRisk: {
      type: String,
      default: " ",
    },
    set: {
      type: Boolean,
      default: "false",
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
module.exports = mongoose.model("JOBTask", JOBTask);
