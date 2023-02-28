const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const LogicalFormFrequency = new Schema(
  {
    formName: String,
    enable: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: [
        "daily",
        "weekly",
        "quaterly",
        "monthly",
        "halfYearly",
        "yearly",
        "onceOff",
      ],
    },
    clientAdminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
module.exports = mongoose.model("LogicalFormFrequency", LogicalFormFrequency);
