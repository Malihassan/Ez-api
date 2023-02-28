const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Form = new Schema(
  {
    formCategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "FormCategory",
    },
    title: String,
    htmlObject: Array,
    configure: Array,
    enable: {
      type: Boolean,
      default: true,
    },
    check: {
      type: Boolean,
      default: false,
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
module.exports = mongoose.model("Form", Form);
