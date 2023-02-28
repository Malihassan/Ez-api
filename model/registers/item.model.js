const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const Item = new Schema(
    {
        parentId: {
            type: mongoose.Types.ObjectId,
            ref: "ItemCategory",
        },
        status: {
            type: String,
            default: "active",
        },
        regDate: {
            type: Date,
            default: Date.now,
        },
        nextSrvDate: {
            type: Date,
            default: Date.now,
        },

    }, {
    timestamps: true,
}

);
module.exports = mongoose.model("Item", Item);
