const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Staff = new Schema(
  {
    title: String,
    status: {
      type: String,
      default: "active",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Staff", Staff);
