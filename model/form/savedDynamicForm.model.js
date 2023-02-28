const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SavedDynamicForm = new Schema(
  {
    formId: {
      type: mongoose.Types.ObjectId,
      ref: "Form",
    },
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
    formIndex: {
      type: String,
    },
    refersTo: {
      type: mongoose.Types.ObjectId,
      ref: "Hazard",
    },
    updated: {
      type: String,
      default: "false",
    },
    version: {
      type: Number,
      default: 1,
    },
    createdTime: String,
    updatedTime: String,
    clientAdminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    createdBy: { type: String },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SavedDynamicForm", SavedDynamicForm);
