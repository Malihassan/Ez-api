const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const OurWork = new Schema(
  {
    title: String,
    image: String,
    description: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("OurWork", OurWork);
