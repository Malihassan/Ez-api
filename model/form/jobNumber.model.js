// var uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const JobNumber = new Schema(
  {
    clientAdminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
    },
    siteId: {
      type: mongoose.Types.ObjectId,
      ref: "Site",
    },
    // siteName: String,
    // streetNumber: String,
    // streetAddress: String,
    // suburb: String,
    stateId: {
      type: mongoose.Types.ObjectId,
      ref: "State",
    },
    // customerName: String,
    // customerContact: String,
    // customerContactPhone: String,
    // customerEmail: String,
    // projectName: String,
    // personCompletingForm: String,
    jobNumber: {
      type: Number,
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

// JobNumber.plugin(uniqueValidator, {
//   message: "Duplication Error, Expected {PATH} to be Unique.",
// });
module.exports = mongoose.model("JobNumber", JobNumber);
