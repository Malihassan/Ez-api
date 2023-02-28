const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressObj = {
  streetNumber: String,
  streetName: String,
  Suburb: String,
  state: String,
  postcode: String,
};
const User = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    avatar: String,
    mobileNumber: String,
    email: String,
    password: String,
    adressLine1: addressObj,
    adressLine2: addressObj,
    licence: [
      {
        documentType: String,
        comment: String,
        path: String,
      },
    ],
    isMobileVerified: {
      type: String,
      enum: ["Not", "Verified"],
      default: "Verified",
    },
    isEmailVerified: {
      type: String,
      enum: ["Not", "Verified"],
      default: "Verified",
    },
    status: {
      type: String,
      default: "active",
    },
    role: { type: mongoose.Types.ObjectId, ref: "Role" },
    department: { type: mongoose.Types.ObjectId, ref: "Department" },
    company: { type: mongoose.Types.ObjectId, ref: "Company" },

    // deviceToken: {
    //   type: String,
    // },

    // website: {
    //   type: String,
    // },
    // designation: {
    //   type: String,
    //   enum: ["SuperAdmin", "ClientAdmin", "User"],
    // },
    // loginType: {
    //   type: String,
    //   enum: ["Google", "Facebook", "Password", "OTP"],
    //   default: "Password",
    //   required: true,
    // },
    // location: {
    //   address: String,
    //   landmark: String,
    //   state: String,
    //   city: String,
    //   postcode: Number,
    //   country: String,
    //   lat: {
    //     type: String,
    //     require: true,
    //   },
    //   lng: {
    //     type: String,
    //     require: true,
    //   },
    // },

    // FirstLogin: {
    //   firstLogin: { type: Boolean, default: true },
    //   step1: { type: Boolean, default: true },
    //   step2: { type: Boolean, default: true },
    //   step3: { type: Boolean, default: true },
    //   step4: { type: Boolean, default: true },
    //   step5: { type: Boolean, default: true },
    // },
    // otp: {
    //   type: String,
    // },

    // // for user registration

    // title: String,
    // position: { type: mongoose.Types.ObjectId, ref: "Role" },
    // department: { type: mongoose.Types.ObjectId, ref: "Department" },
    // phone: String,
    // suburb: String,
    // uploadImage: String,

    // clientAdminId: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    // emergencyContact: {
    //   firstName: String,
    //   lastName: String,
    //   relationship: String,
    //   email: String,
    //   phone: String,
    //   mobile: String,
    // },
    // licence: Array,
    // // licenceName: String,
    // // licenceNumber: Number,
    // // trainingOrganisation: String,
    // // expiryDate: String,
    // // uploadLicence: Array,

    // ppe: {
    //   PPEArr: Array,
    //   signature: String,
    // },
    // plant: {
    //   plantArr: Array,
    //   plantSignature: String,
    // },
    // reportingTo: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    // stateId: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "State",
    // },
    // password: String,
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("User", User);
(async () => {
  const userModalCount = await userModel.find({}).countDocuments();
  if (userModalCount == 0) {
    userModel.create({
      firstName: "momen",
      lastName: "zakaria",
      email: "abc@gmail.com",
      mobileNumber: "01095451290",
      password: bcrypt.hashSync("11111", 8),
      role: "63ee03a89a63625ad3ecf52e",
      company: "63ee0f0d4c865a6bee97f5a6",
    });
  }
})();
module.exports = userModel;
