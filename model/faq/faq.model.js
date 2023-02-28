const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const FAQ = new Schema(
  {
    portalId: {
      type: mongoose.Types.ObjectId,
      ref: "Portal",
    },
    question: String,
    answer: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("FAQ", FAQ);
