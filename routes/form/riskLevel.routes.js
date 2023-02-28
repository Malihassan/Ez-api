const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const RiskLevel = mongoose.model("RiskLevel");
const auth = require("../../helper/auth");

// add Risk Level
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/RiskLevel");
    const result = await commonController.add(RiskLevel, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.RISK_LEVEL_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_RISK_LEVEL);
  }
});

// add multiple Risk Level
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/RiskLevel");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        ...{ userId: req.userId }
      });
    });
    console.log(obj);
    const responseObj = await RiskLevel.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.RISK_LEVEL_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_RISK_LEVEL);
  }
});

// get all Risk Level
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/RiskLevel");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        RiskLevel,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(RiskLevel, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RISK_LEVEL);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/RiskLevel");
//     const result = await commonController.getAllRecordSorted(
//       RiskLevel,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RISK_LEVEL);
//   }
// });

// get Risk Level
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/RiskLevel", req.params.id);
    const result = await commonController.getOne(RiskLevel, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RISK_LEVEL);
  }
});

// update Risk Level
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/RiskLevel", req.params.id);
    const result = await commonController.updateBy(
      RiskLevel,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.RISK_LEVEL_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_RISK_LEVEL + req.params.id
    );
  }
});

// delete Risk Level
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/RiskLevel", req.params.id);
    const result = await commonController.delete(RiskLevel, req.params.id);
    response.successResponse(res, 200, MESSAGE.RISK_LEVEL_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_RISK_LEVEL + req.params.id
    );
  }
});

module.exports = router;
