const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TermsAndCondition = new Schema(
  {
    termsAndCond: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("TermsAndCondition", TermsAndCondition);
