const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SiteInspection = new Schema(
  {
    allJobNumbersArr: Array,
    allTopic: Array,
    allcategory: Array,
    custConct: String,
    custConctPh: String,
    custEmail: String,
    customerName: String,
    date: String,
    jobNumber: String,
    projectManager: String,
    projectMangArr: Array,
    siteAction: [
      {
        action: String,
        personRes: { type: mongoose.Types.ObjectId, ref: "User" },
        completed: { type: Boolean, default: false },
        date: { type: Date, default: Date.now },
        formName: { type: String, default: "Site Inspection" },
        topicId: String,
        item: String,
      },
    ],
    siteCategorytTopic: Array,
    siteName: String,
    staffArr: Array,
    streetAddr: String,
    empName: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    submitDate: String,
    signature: String,
    formId: {
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
module.exports = mongoose.model("SiteInspection", SiteInspection);
