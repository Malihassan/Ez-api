const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Plan = mongoose.model("Plan");

// add Plan
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Plan");
    const data = await Plan.findOne();
    // if (data) {
    //   const deleteData = await Plan.findOneAndDelete({ _id: data._id });
    //   const result = await commonController.add(Plan, req.body);
    //   response.successResponse(res, 200, MESSAGE.PLAN_CREATED + result._id);
    // } else {
    //   const result = await commonController.add(Plan, req.body);
    //   response.successResponse(res, 200, MESSAGE.PLAN_CREATED + result._id);
    // }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_PLAN);
  }
});

// get Plan
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/aboutUs", req.params.id);
    const result = await commonController.getOne(Plan, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PLAN);
  }
});

// get all Plan
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/plans");
    const result = await commonController.getAllRecordByPopulate(Plan, {
      path: "coupons",
      model: "Coupon",
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PLAN);
  }
});

// update Plan
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/plans", req.params.id);
    const result = await commonController.updateBy(
      Plan,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.PLAN_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_PLAN + req.params.id
    );
  }
});

// delete Plan
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/plans", req.params.id);
    const result = await commonController.delete(Plan, req.params.id);
    response.successResponse(res, 200, MESSAGE.PLAN_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_PLAN + req.params.id
    );
  }
});

module.exports = router;
