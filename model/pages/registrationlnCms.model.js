const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const RegistrationlnCms = new Schema(
  {
    section1: { p1: String, p2: String },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("RegistrationlnCms", RegistrationlnCms);
