const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const IdentifyHazard = mongoose.model("IdentifyHazard");
const auth = require("../../helper/auth");

// add Identify Hazard
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/IdentifyHazard");
    const result = await commonController.add(IdentifyHazard, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.IDENTIFY_HAZARD_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_IDENTIFY_HAZARD
    );
  }
});

// add multiple Identify Hazard
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/IdentifyHazard");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await IdentifyHazard.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.IDENTIFY_HAZARD_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_IDENTIFY_HAZARD
    );
  }
});

// get all Identify Hazard
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/IdentifyHazard");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      console.log("inside if statement");
      const result = await commonController.getAllRecordBySorting(
        IdentifyHazard,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      console.log("inside else statement");
      const result = await commonController.getAll(IdentifyHazard, { userId: req.userId });

      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_IDENTIFY_HAZARD
    );
  }
});

router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/IdentifyHazard");
    const result = await commonController.getAllSortReverse(IdentifyHazard, { userId: req.userId });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_IDENTIFY_HAZARD
    );
  }
});

// get Identify Hazard
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/IdentifyHazard", req.params.id);
    const result = await commonController.getOne(IdentifyHazard, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_IDENTIFY_HAZARD
    );
  }
});

// update Identify Hazard
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/IdentifyHazard", req.params.id);
    const result = await commonController.updateBy(
      IdentifyHazard,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.IDENTIFY_HAZARD_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_IDENTIFY_HAZARD + req.params.id
    );
  }
});

// delete Identify Hazard
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/IdentifyHazard", req.params.id);
    const result = await commonController.delete(IdentifyHazard, req.params.id);
    response.successResponse(res, 200, MESSAGE.IDENTIFY_HAZARD_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_IDENTIFY_HAZARD + req.params.id
    );
  }
});

//identifyHAzardGetAll
router.patch("/updateAll", async (req, res) => {
  try {
    log.debug("IdentifyHazard/updateAll");
    const { order, jobTaskId } = req.body;
    console.log(order, jobTaskId);
    const promises = order.map(async (o, index) => {
      // let orderkey = index + 1;
      const promise = IdentifyHazard.updateOne(
        { _id: o._id },
        { $set: { jobTaskId: o.jobTaskId } }
      );
      return promise;
    });

    const results = await Promise.all(promises);
    console.log(order, results);
    response.successResponse(res, 200, { data: results });
    // TradeCategory.updateOne()
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_IDENTIFY_HAZARD
    );
  }
});

module.exports = router;
