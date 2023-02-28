const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const ResidualRisk = mongoose.model("ResidualRisk");
const auth = require("../../helper/auth");

// add Residual Risk
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/ResidualRisk");
    const result = await commonController.add(ResidualRisk, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.RESIDUAL_RISK_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_RESIDUAL_RISK);
  }
});

// add multiple Residual Risk
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/ResidualRisk");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await ResidualRisk.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.RESIDUAL_RISK_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_RESIDUAL_RISK);
  }
});

// get all Residual Risk
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/ResidualRisk");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        ResidualRisk,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(ResidualRisk, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RESIDUAL_RISK);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/ResidualRisk");
//     const result = await commonController.getAllRecordSorted(
//       ResidualRisk,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RESIDUAL_RISK);
//   }
// });

// get Residual Risk
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/ResidualRisk", req.params.id);
    const result = await commonController.getOne(ResidualRisk, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_RESIDUAL_RISK);
  }
});

// update Residual Risk
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/ResidualRisk", req.params.id);
    const result = await commonController.updateBy(
      ResidualRisk,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.RESIDUAL_RISK_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_RESIDUAL_RISK + req.params.id
    );
  }
});

// delete Residual Risk
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/ResidualRisk", req.params.id);
    const result = await commonController.delete(ResidualRisk, req.params.id);
    response.successResponse(res, 200, MESSAGE.RESIDUAL_RISK_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_RESIDUAL_RISK + req.params.id
    );
  }
});

module.exports = router;
