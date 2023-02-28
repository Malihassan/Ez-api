const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const Branch = new Schema(
    {
        branchName: String,
        email: String,
        phone: String,
        address: String,
        licenceNumber: String,
        departments: String,
        numberOfEmpoyees: Number,
        companyDetailId: { type: mongoose.Types.ObjectId, ref: "CompanyDetail" },

        // mailingSubUrb: String,
        // mailingState: String,
        // mailingPostcode: String,
        // isMailingAddress: { type: Boolean, default: false },

        // stateId: { type: mongoose.Types.ObjectId, ref: "State" },

        // plantRegister: { plant: Array },
        // insuranceRegister: { insurance: Array },
        // userId: { type: mongoose.Types.ObjectId, ref: "User" },

        status: {
            type: String,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Branch", Branch);
