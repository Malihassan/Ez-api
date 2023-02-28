const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const PPE = mongoose.model("PPE");

// add PPE
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/PPE");
    const result = await commonController.add(PPE, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.PPE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_PPE);
  }
});

// add multiple PPE
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/PPE");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await PPE.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.PPE_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_PPE);
  }
});

// get all PPE
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/PPE");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        PPE,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(PPE, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PPE);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/PPE");
//     const result = await commonController.getAllRecordSorted(PPE, "title");
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PPE);
//   }
// });

// get PPE
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/PPE", req.params.id);
    const result = await commonController.getOne(PPE, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PPE);
  }
});

// update PPE
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/PPE", req.params.id);
    const result = await commonController.updateBy(
      PPE,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.PPE_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_PPE + req.params.id
    );
  }
});

// delete PPE
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/PPE", req.params.id);
    const result = await commonController.delete(PPE, req.params.id);
    response.successResponse(res, 200, MESSAGE.PPE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_PPE + req.params.id
    );
  }
});

module.exports = router;
