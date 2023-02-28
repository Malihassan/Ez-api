const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Department = new Schema(
  {
    departmentName: String,
    clientAdminId: { type: mongoose.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Department", Department);
