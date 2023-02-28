const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SubContractor = new Schema(
  {
    companyName: String,
    phone: String,
    fax: String,
    email: String,
    streetAddress: String,
    suburb: String,
    postCode: String,
    mailingAddress: String,
    ABN: String,
    licenceNumber: String,
    website: String,
    licenceAndQualifications: Array,
    stateId: {
      type: mongoose.Types.ObjectId,
      ref: "State",
    },
    status: {
      type: String,
      default: "active",
    },
    clientAdminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SubContractor", SubContractor);
