const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const mongoose = require("mongoose");
const ChangesMade = mongoose.model("ChangesMade");

// add Changes Made
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/ChangesMade");
    const result = await commonController.add(ChangesMade, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.CHANGES_MADE_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CHANGES_MADE);
  }
});

// add multiple Changes Made
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/ChangesMade");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await ChangesMade.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.MULTIPLE_CHANGES_MADE_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_CHANGES_MADE);
  }
});

// get all Changes Made
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/ChangesMade");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        ChangesMade,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(ChangesMade, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CHANGES_MADE);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/ChangesMade");
//     const result = await commonController.getAllRecordSorted(
//       ChangesMade,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CHANGES_MADE);
//   }
// });

// get Changes Made
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/ChangesMade", req.params.id);
    const result = await commonController.getOne(ChangesMade, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_CHANGES_MADE);
  }
});

// update Changes Made
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/ChangesMade", req.params.id);
    const result = await commonController.updateBy(
      ChangesMade,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.CHANGES_MADE_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_CHANGES_MADE + req.params.id
    );
  }
});

// delete Changes Made
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/ChangesMade", req.params.id);
    const result = await commonController.delete(ChangesMade, req.params.id);
    response.successResponse(res, 200, MESSAGE.CHANGES_MADE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_CHANGES_MADE + req.params.id
    );
  }
});

module.exports = router;
