const tableStatus = require("../../helper/enums/tableStatus");
const mongoose = require("mongoose");

const Plan = new mongoose.Schema(
  {
    name: String,
    userLimit: Number,
    monthlyPrice: Number,
    monthlyDiscount: Number,
    yearlyPrice: Number,
    yearlyDiscount: Number,
    stripeProductID: String,
    stripeProductPriceID: String,
    // permissions:{
    //   riskAssessment:Boolean
    // }
    coupons: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Coupon",
      },
    ],
    status: {
      type: String,
      default: tableStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);
const planModel = mongoose.model("Plan", Plan);

(async () => {
  const plantModalCount = await planModel.find({}).countDocuments();
  if (plantModalCount == 0) {
    planModel.insertMany([
      {
        name: "Growth",
        stripeProductID: "prod_NM42IO56lDZWfQ",
        stripeProductPriceID: "price_1MbLusCTQh8l4pvLvAR3rNrv",
        userLimit: 15,
        monthlyPrice: 90,
        monthlyDiscount: 0,
        yearlyPrice: 90 * 11,
        yearlyDiscount: 90,
        coupons: ["63ea1914ac919c634ad27dbf"],
      },
      {
        name: "Business",
        stripeProductID: "prod_NMRQnKBK6FgI6S",
        stripeProductPriceID: "price_1MbiXPCTQh8l4pvLyeuDD88u",
        userLimit: 10,
        monthlyPrice: 55,
        monthlyDiscount: 0,
        yearlyPrice: 55 * 11,
        yearlyDiscount: 55,
        coupons: ["63ea1914ac919c634ad27dc0"],
      },
      {
        name: "Essentials",
        stripeProductID: "prod_NMRRs0haS3LpHa",
        stripeProductPriceID: "price_1MbiYmCTQh8l4pvLLeRr5B31",
        userLimit: 9,
        monthlyPrice: 39,
        monthlyDiscount: 0,
        yearlyPrice: 39 * 11,
        yearlyDiscount: 39,
        coupons: ["63ea1914ac919c634ad27dbf", "63ea1914ac919c634ad27dc1"],
      },
    ]);
  }
})();

module.exports = planModel;
