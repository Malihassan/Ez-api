const mongoose = require("mongoose");
Schema = mongoose.Schema;

const Team = new Schema(
  {
    aboutUsId: {
      type: mongoose.Types.ObjectId,
      ref: "AboutUs",
    },
    title: String,
    imageUrl: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Team", Team);
