const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SubscriptionCms = new Schema(
  {
    section1: {
      p1: String,
      p2: String,
      yourPlan: {
        title: String,
        p: String,
      },
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
module.exports = mongoose.model("SubscriptionCms", SubscriptionCms);
