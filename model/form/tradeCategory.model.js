const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TradeCategory = new Schema(
  {
    title: String,
    show: Boolean,
    order: { type: Number },
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
module.exports = mongoose.model("TradeCategory", TradeCategory);
