const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Licence = new Schema(
  {
    tradeCategoryId: Array,
    title: String,
    clientAdminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
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
module.exports = mongoose.model("Licence", Licence);
