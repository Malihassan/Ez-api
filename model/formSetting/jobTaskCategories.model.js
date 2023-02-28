const mongoose = require("mongoose");
const tableStatus = require("../../helper/enums/tableStatus");
const jobTaskCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    checkboxes: [
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
  },
  {
    timestamps: true,
  }
);

const jobTaskCategoryModel = mongoose.model(
  "JobTaskCategory",
  jobTaskCategorySchema
);

module.exports = jobTaskCategoryModel;
