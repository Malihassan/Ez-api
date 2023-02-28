const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const updateRecords = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        moduleName: String,
        recordsIds: [],
        status: {
            type: String,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("updateRecords", updateRecords);
