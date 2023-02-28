const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Module = new Schema(
  {
    title: String,
    description: String,
    status: {
      type: String,
      default: "active",
    },
    mode: {
      type: String,
      enum: [
        "Service",
        "Safety",
        "Flexible",
        "HappyClient",
        "Testimonial",
        "FAQ",
        "System",
        "Screenshot",
        "Different",
        "Terms",
      ],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Module", Module);
