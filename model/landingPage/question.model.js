const mongoose = require("mongoose");
Schema = mongoose.Schema;

var Question = new Schema(
  {
    title: String,
    description: String,
    fileUrl: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Question", Question);
