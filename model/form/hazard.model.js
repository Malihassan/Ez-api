const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const CorrectiveAction = new Schema({
  action: String,
  personRes: { type: mongoose.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  formName: { type: String, default: "Hazard" },
});

const Hazard = new Schema(
  {
    myControl: { type: mongoose.Types.ObjectId, ref: "User" },
    myControlManager: String,
    // employeeFulltime: String,
    employeeParttime: String,
    // employeeCasual: String,
    // employeeContractor: String,

    fullName: String,
    email: String,
    phone: String,
    department: { type: mongoose.Types.ObjectId, ref: "Department" },
    position: { type: mongoose.Types.ObjectId, ref: "Role" },
    projectName: String,
    managerSupervisor: { type: mongoose.Types.ObjectId, ref: "User" },
    managerSupervisorEmail: String,
    whsManager: String,
    whsManagerEmail: String,

    describeHazard: String,
    dateHazardReport: String,
    locationHazard: String,
    dateHazardIdentify: String,
    jobNumberId: {
      type: mongoose.Types.ObjectId,
      ref: "JobNumber",
    },
    action: String,
    elliminateAction: CorrectiveAction,
    substituteAction: CorrectiveAction,
    isolatedAction: CorrectiveAction,
    solutionAction: CorrectiveAction,
    procedureRemoveAction: CorrectiveAction,
    PPEAction: CorrectiveAction,
    name: String,
    compilePosition: { type: mongoose.Types.ObjectId, ref: "Role" },
    compileDepartment: { type: mongoose.Types.ObjectId, ref: "Department" },
    fileUpload: String,
    date: String,
    signaturePad1: String,
    complete: String,
    consequence: Number,
    riskRating: String,
    actionRequired: String,
    likelihood: Number,
    reduceRisk: String,
    procedures: String,
    process: String,
    isolatedHazard: String,
    eliminateHazardAction: String,
    refersTo: {
      type: mongoose.Types.ObjectId,
      ref: "Hazard",
    },
    formId: {
      type: String,
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
module.exports = mongoose.model("Hazard", Hazard);
