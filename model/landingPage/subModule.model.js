const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SubModule = new Schema(
  {
    moduleId: {
      type: mongoose.Types.ObjectId,
      ref: "Module",
    },
    title: String,
    subTitle: String,
    description: String,
    fileUrl: String,
    question: String,
    answer: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SubModule", SubModule);
