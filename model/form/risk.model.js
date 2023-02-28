const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Risk = new Schema(
  {
    title: String,
    indexNo: String,
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
module.exports = mongoose.model("Risk", Risk);
