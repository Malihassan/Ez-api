const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SubmittedDynamicForm = new Schema(
  {
    formData: [
      {
        pmId: {
          type: mongoose.Types.ObjectId,
          ref: "ProjectManager",
        },
        title: String,
        signature: String,
      },
    ],

    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SubmittedDynamicForm", SubmittedDynamicForm);
