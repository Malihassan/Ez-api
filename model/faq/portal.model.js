const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Portal = new Schema(
  {
    title: {
      type: String,
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
module.exports = mongoose.model("Portal", Portal);
