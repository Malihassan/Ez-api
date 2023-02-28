const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Regulator = new Schema(
  {
    title: String,
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
module.exports = mongoose.model("Regulator", Regulator);
