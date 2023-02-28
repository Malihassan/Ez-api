const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Customer = new Schema(
  {
    customerName: String,
    customerContact: String,
    streetAddress: String,
    postCode: String,
    ABN: String,
    suburb: String,
    stateId: {
      type: mongoose.Types.ObjectId,
      ref: "State",
    },
    contacts: [
      { title: String, position: String, email: String, phone: String },
    ],
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Customer", Customer);
