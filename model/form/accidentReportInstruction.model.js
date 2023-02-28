const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const AccidentReportInstruction = new Schema(
  {
    instruction: String,
    status: {
      type: String,
      default: "active",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "AccidentReportInstruction",
  AccidentReportInstruction
);
