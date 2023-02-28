const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Employee = new Schema(
  {
    // deviceToken: String,
    title: String,
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    position: String,
    department: String,
    phone: String,
    mobile: String,
    suburb: String,
    uploadImage: String,
    roleId: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    location: {
      address: String,
      landmark: String,
      state: String,
      city: String,
      pincode: Number,
      country: String,
      postcode: Number,
      lat: {
        type: String,
        require: true,
      },
      lng: {
        type: String,
        require: true,
      },
    },
    emergencyContact: {
      firstName: String,
      lastName: String,
      relationship: String,
      email: String,
      phone: String,
      mobile: String,
    },
    licence: Array,
    // licenceName: String,
    // licenceNumber: Number,
    // trainingOrganisation: String,
    // expiryDate: String,
    // uploadLicence: Array,

    ppe: {
      PPEArr: Array,
      signature: String,
    },
    plant: {
      plantArr: Array,
      plantSignature: String,
    },
    reportingTo: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
    stateId: {
      type: mongoose.Types.ObjectId,
      ref: "State",
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
module.exports = mongoose.model("Employee", Employee);
