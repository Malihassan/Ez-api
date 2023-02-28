const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const COP = mongoose.model("COP");
const auth = require("../../helper/auth");

// add COP
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/COP");
    const result = await commonController.add(COP, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.COP_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_COP);
  }
});

// add multiple COP
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/COP");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await COP.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.COP_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_COP);
  }
});

// get all COP
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/COP");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        COP,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(COP, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COP);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/COP");
//     const result = await commonController.getAllRecordSorted(COP, "title");
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COP);
//   }
// });

// get COP
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/COP", req.params.id);
    const result = await commonController.getOne(COP, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COP);
  }
});

// update COP
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/COP", req.params.id);
    const result = await commonController.updateBy(
      COP,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.COP_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_COP + req.params.id
    );
  }
});

// delete COP
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/COP", req.params.id);
    const result = await commonController.delete(COP, req.params.id);
    response.successResponse(res, 200, MESSAGE.COP_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_COP + req.params.id
    );
  }
});

module.exports = router;
