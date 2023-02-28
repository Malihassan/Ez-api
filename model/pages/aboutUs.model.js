const mongoose = require("mongoose");
Schema = mongoose.Schema;

const AboutUs = new Schema(
  {
    description: String,
    imageUrl: String,
    title: String,
    subTitle: String,
    desc: String,
    fileUrl: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("AboutUs", AboutUs);
