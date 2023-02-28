const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const PPEReturn = new Schema(
  {
    clientAdminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    submitPPEArr: Array,
    managerName: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: String,
    },
    signature: {
      type: String,
    },
    fileType: {
      type: String,
      default: "PPE",
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
module.exports = mongoose.model("PPEReturn", PPEReturn);
