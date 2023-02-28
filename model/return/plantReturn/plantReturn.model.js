const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const PlantReturn = new Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    submitPlantArr: Array,
    managerName: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    clientAdminId: {
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
      default: "Plant/Equipment",
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
module.exports = mongoose.model("PlantReturn", PlantReturn);
