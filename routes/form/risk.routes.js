const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const Risk = mongoose.model("Risk");
const auth = require("../../helper/auth");

// add Risk
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/risk");
    let responseObj = {
      title: req.body.title,
      indexNo: `WHS-${1}`,
      userId: req.userId
    };
    const data = await Risk.find().sort({ _id: -1 }).limit(1);
    if (data) {
      const recentIndexNo = data.indexNo;
      console.log("======>>>>>", recentIndexNo);
    } else {
      responseObj = {
        title: req.body.title,
        indexNo: `WHS-${1}`,
        userId: req.userId
      };
      const result = await commonController.add(Risk, responseObj);
      response.successResponse(res, 200, MESSAGE.RISK_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_RISK);
  }
});

// add multiple Risk
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/Risk");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await Risk.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.RISK_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_RISK);
  }
});

// get all Risk
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/Risk");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Risk,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Risk, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RISK);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/risk");
//     const result = await commonController.getAllRecordSorted(Risk, "title");
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RISK);
//   }
// });

// get Risk
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/risk", req.params.id);
    const result = await commonController.getOne(Risk, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RISK);
  }
});

// update Risk
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Risk", req.params.id);
    const result = await commonController.updateBy(
      Risk,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.RISK_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_RISK + req.params.id
    );
  }
});

// delete Risk
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Risk", req.params.id);
    const result = await commonController.delete(Risk, req.params.id);
    response.successResponse(res, 200, MESSAGE.RISK_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_RISK + req.params.id
    );
  }
});

module.exports = router;
