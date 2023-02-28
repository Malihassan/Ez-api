
const mongoose = require("mongoose")
const tableStatus = require("../../helper/enums/tableStatus");

const Coupon = new mongoose.Schema(
  {
    couponName: String,
    discount: Number,
    status: {
      type: String,
      default: tableStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);
const couponModel = mongoose.model("Coupon", Coupon);
(async()=>{
  const couponModelCount = await couponModel.find({}).countDocuments()
  if(couponModelCount == 0){
    couponModel.insertMany([
     {
      couponName:"Winter",
      discount:6
     },{
      couponName:"Summer",
      discount:4
     },{
      couponName:"New Year",
      discount:5
     }
   ])
  }
 })()
module.exports = couponModel
