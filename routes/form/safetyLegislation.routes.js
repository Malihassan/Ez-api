const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const SafetyLegislation = mongoose.model("SafetyLegislation");
const auth = require("../../helper/auth");

// add Safety Legislation
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/SafetyLegislation");
    req.body['userId'] = req.userId;
    const result = await commonController.add(SafetyLegislation, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.SAFETY_LEGISLATION_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SAFETY_LEGISLATION
    );
  }
});

// add multiple Safety Legislation
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/SafetyLegislation");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        act: element.act == undefined ? (element.act = "") : element.act,
        regulation:
          element.regulation == undefined
            ? (element.regulation = "")
            : element.regulation,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await SafetyLegislation.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.SAFETY_LEGISLATION_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SAFETY_LEGISLATION
    );
  }
});

// get all Safety Legislation
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/SafetyLegislation");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        SafetyLegislation,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(SafetyLegislation, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SAFETY_LEGISLATION
    );
  }
});

// get Safety Legislation
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/SafetyLegislation", req.params.id);
    const result = await commonController.getOne(SafetyLegislation, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SAFETY_LEGISLATION
    );
  }
});

// update Safety Legislation
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/SafetyLegislation", req.params.id);
    const result = await commonController.updateBy(
      SafetyLegislation,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SAFETY_LEGISLATION_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SAFETY_LEGISLATION + req.params.id
    );
  }
});

// delete Safety Legislation
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SafetyLegislation", req.params.id);
    const result = await commonController.delete(
      SafetyLegislation,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.SAFETY_LEGISLATION_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SAFETY_LEGISLATION + req.params.id
    );
  }
});

module.exports = router;
