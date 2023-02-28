const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SiteInspectionCategory = new Schema(
  {
    category: String,
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
  "SiteInspectionCategory",
  SiteInspectionCategory
);
