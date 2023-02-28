const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const CompanyDetail = new Schema(
  {
    // company: {
    //   name: String,
    //   abn: String,
    //   address: String,
    //   website: String,
    //   agentOfReference: String,
    // },
    // keyPerson: { name: String, contact: String, phone: Number, email: String },
    // financial: { name: String, position: String, phone: Number, email: String },
    // systemDetails: {
    //   employees: String,
    //   contractors: String,
    //   subscriptionType: {
    //     type: String,
    //     enum: ["ANNUAL", "MONTHLY"],
    //   },
    //   applyCoupen: String,
    // },

    companyName: String,
    email: String,
    phone: String,
    companyABN: String,
    streetAddress: String,
    suburb: String,
    website: String,

    fax: String,
    mailingAddress: String,
    companyAddress: String,
    licenceNumber: String,
    companyLogo: String,
    postcode: Number,

    linkedIn: String,
    instgram: String,
    departments: String,
    numberOfEmpoyees: Number,
    branches: [{ type: mongoose.Types.ObjectId, ref: "Branch" }],


    mailingSubUrb: String,
    mailingState: String,
    mailingPostcode: String,
    isMailingAddress: { type: Boolean, default: false },

    stateId: { type: mongoose.Types.ObjectId, ref: "State" },

    plantRegister: { plant: Array },
    insuranceRegister: { insurance: Array },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CompanyDetail", CompanyDetail);
