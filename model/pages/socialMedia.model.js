const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SocialMedia = new Schema(
  {
    youtube: String,
    facebook: String,
    twitter: String,
    instagram: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SocialMedia", SocialMedia);
