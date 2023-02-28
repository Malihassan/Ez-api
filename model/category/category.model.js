const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Category = new Schema(
  {
    title: {
      type: String,
    },
    updated: {
      type: String,
      default: "false",
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
module.exports = mongoose.model("Category", Category);
