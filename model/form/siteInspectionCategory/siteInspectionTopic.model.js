const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SiteInspectionTopic = new Schema(
  {
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    topic: String,
    item: String,
    action: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SiteInspectionTopic", SiteInspectionTopic);
