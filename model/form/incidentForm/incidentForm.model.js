const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const IncidentForm = new Schema(
  {
    PPE: Array,
    // corrective action
    corrAction: [
      {
        action: String,
        personRes: { type: mongoose.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false },
        formName: { type: String, default: "Accident" },
      },
    ],
    changes: Array,
    completedDate: String,
    completedDepartment: String,
    completedName: String,
    completedPosition: String,
    customerContact: String,
    customerContactPhone: String,
    customerEmail: String,
    customerName: String,
    dateOfFormCompletion: String,
    dateOfTheIncident: String,
    department: String,
    file: String,
    incidents: Array,
    instructions: String,
    jobNumber: String,
    locationOfTheIncident: String,
    name: String,
    nameOfWitness: String,
    natureOFIncidents: Array,
    personCompletingForm: String,
    position: String,
    priorIncident: String,
    priorIncidentText: String,
    projectManager: { type: mongoose.Types.ObjectId, ref: "User" },
    projectName: String,
    reviewedDate: String,
    reviewedDepartment: String,
    reviewedName: String,
    reviewedPosition: String,
    rootCauseIncident: Array,
    signaturePad: String,
    signaturePad1: String,
    similarIncident: String,
    similarIncidentText: String,
    siteName: String,
    streetAddress: String,
    timeOfTheIncident: String,
    whyDidtheUnsafeConditonExist: String,
    witnessStatement: String,
    changesArr: Array,
    natureOFIncidentsArr: Array,
    rootCauseIncidentArr: Array,
    incidentsArr: Array,
    ppeArr: Array,
    allJobNumbersArr: Array,
    projectMangArr: Array,
    staffArr: Array,
    formId: {
      type: String,
    },
    changesMadeOther: {
      type: Boolean,
      default: false,
    },
    changesMadeOtherText: String,
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
module.exports = mongoose.model("IncidentForm", IncidentForm);
