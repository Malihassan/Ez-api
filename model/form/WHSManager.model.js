const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const WHSManager = new Schema(
  {
    name: String,
    email: String,
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
module.exports = mongoose.model("WHSManager", WHSManager);
