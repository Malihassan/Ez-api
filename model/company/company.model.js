const tableStatus = require("../../helper/enums/tableStatus");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const addressObj = {
  streetNumber: String,
  streetName: String,
  city: String,
  state: String,
  postcode: String,
};
const branchObj = {
  name: String,
  phone: String,
  department: String,
  teamSize: String,
  licenseNumber: String,
  address: String,
};
const Company = new Schema(
  {
    companyName: String,
    ABN: String,
    ACN: String,
    accountType: String,
    teamSize: String,
    companyIndustry: String,
    companyDepartment: String,
    companyPhone: String,
    companyFax: String,
    companyEmail: String,
    companyDescription: String,
    companyAddress: addressObj,
    // contactPerson: {
    //   name: String,
    //   email: String,
    //   phone: String,
    //   address: addressObj,
    // },
    socialMediaProfiles: [
      {
        platform: {
          type: String,
          default: "LinkedIn",
        },
        link: {
          type: String,
          default: "",
        },
      },
      {
        platform: {
          type: String,
          default: "Facebook",
        },
        link: {
          type: String,
          default: "",
        },
      },
      {
        platform: {
          type: String,
          default: "Instagram",
        },
        link: {
          type: String,
          default: "",
        },
      },
      {
        platform: {
          type: String,
          default: "Twitter",
        },
        link: {
          type: String,
          default: "",
        },
      },
      {
        platform: {
          type: String,
          default: "Telegram",
        },
        link: {
          type: String,
          default: "",
        },
      },
    ],
    website: String,
    companyLogo: String,
    businessLicenses: String,
    plan: [{ type: mongoose.Types.ObjectId, ref: "Plan" }],
    branches: [branchObj],

    status: {
      type: String,
      default: tableStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);
const companyModel = mongoose.model("Company", Company);

(async () => {
  const companyModalCount = await companyModel.find({}).countDocuments();
  if (companyModalCount == 0) {
    companyModel.create({
      accountType: "personal",
      teamSize: "50+",
      companyName: "test Company",
      companyIndustry: "Airport operations",
      companyDepartment: "test Department",
      companyEmail: "momenalhendawy@gmail.com",
      companyPhone: "01095451290",
      companyFax: "555-123-4567",
      companyDescription: "test Discription",
      plan: "63ecbe18021a5478b615231d",
    });
  }
})();

module.exports = companyModel;
