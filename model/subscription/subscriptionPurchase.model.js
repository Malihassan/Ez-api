const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SubscriptionPurchase = new Schema(
  {
    companyName: String,
    email: String,
    phone: String,
    companyABN: String,
    streetAddress: String,
    suburb: String,
    website: String,

    stripeToken: String,

    amount: Number,
    employeePurchased: Number,
    subscriptionType: String,
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
module.exports = mongoose.model("SubscriptionPurchase", SubscriptionPurchase);
