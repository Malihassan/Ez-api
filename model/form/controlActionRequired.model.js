const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const ControlActionRequired = new Schema(
  {
    title: String,
    jobTaskId: String,
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
module.exports = mongoose.model("ControlActionRequired", ControlActionRequired);
