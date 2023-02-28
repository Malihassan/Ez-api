const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const ToolBox = new Schema(
  {
    jobNumberId: {
      type: mongoose.Types.ObjectId,
      ref: "JobNumber",
    },
    customerName: String,
    custEmail: String,
    custConct: String,
    custConctPh: String,
    siteName: String,
    streetAddr: String,
    signaturePad1: String,
    date: String,

    attendees: Array,
    //corective action
    corrAction: [
      {
        action: String,
        personRes: { type: mongoose.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false },
        formName: { type: String, default: "Toolbox" },
      },
    ],
    issues: Array,

    
    dateTooboxTalk: String,
    meetingBy: {
      type: mongoose.Types.ObjectId,
      ref: "Staff",
    },
    personResponsible: {
      type: mongoose.Types.ObjectId,
      ref: "Staff",
    },
    refersTo: {
      type: mongoose.Types.ObjectId,
      ref: "ToolBox",
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
    formId: {
      type: String,
    },
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
module.exports = mongoose.model("ToolBox", ToolBox);
