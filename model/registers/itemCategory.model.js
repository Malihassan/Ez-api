const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const ItemCategory = new Schema(
    {
        ItemCategoryName: {
            type: String,
        },
        status: {
            type: String,
            default: "active",
        },
        type: {
            type: String,
            enum: [
                "plant",
                "equipment",
                "PPE",
            ],
        },

    }, {
    timestamps: true,
}


);
module.exports = mongoose.model("ItemCategory", ItemCategory);
