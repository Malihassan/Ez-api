const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const Coupon = mongoose.model("Coupon");

//add Coupon
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Coupon");
    const result = await commonController.add(Coupon, req.body);
    response.successResponse(res, 200, MESSAGE.COUPON_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_COUPON);
  }
});

// get all Coupon
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/coupon");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Coupon,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Coupon);
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COUPON);
  }
});

// get coupon
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/coupon", req.params.id);
    const result = await commonController.getOne(Coupon, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COUPON);
  }
});

// update coupon
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/coupon", req.params.id);
    const result = await commonController.updateBy(
      Coupon,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.COUPON_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_COUPON + req.params.id
    );
  }
});

// delete coupon
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/coupon", req.params.id);
    const result = await commonController.delete(Coupon, req.params.id);
    response.successResponse(res, 200, MESSAGE.COUPON_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_COUPON + req.params.id
    );
  }
});

module.exports = router;
