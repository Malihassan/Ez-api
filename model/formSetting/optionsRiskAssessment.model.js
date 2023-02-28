const mongoose = require("mongoose");
const tableStatus = require("../../helper/enums/tableStatus");
const riskAssessmentOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      enum: [
        "High Risk Construction",
        "PPE Selection",
        "Licence And Qualifications",
        "Code Of Practice",
      ],
    },
    relatedCheckboxes: [
      { type: mongoose.Types.ObjectId, ref: "RiskAssessmentOption" },
    ],
    status: {
      type: String,
      default: tableStatus.ACTIVE,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
    identityHazard: String,
    controlAndAction: String,
  },
  {
    timestamps: true,
  }
);

const riskAssessmentOptionModel = mongoose.model(
  "RiskAssessmentOption",
  riskAssessmentOptionSchema
);
module.exports = riskAssessmentOptionModel;
