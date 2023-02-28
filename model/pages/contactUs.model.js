const mongoose = require("mongoose");
Schema = mongoose.Schema;

const ContactUs = new Schema(
  {
    fullName: String,
    phone: String,
    query: String,
    email: String,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ContactUs", ContactUs);
