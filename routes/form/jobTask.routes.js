const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const auth = require("../../helper/auth");
const JOBTask = mongoose.model("JOBTask");

// add JOBTask
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/JOBTask");
    const result = await commonController.add(JOBTask, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.JOB_TASK_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_JOB_TASK);
  }
});

// add multiple job task
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/jobTask");
    // var obj = [];
    // req.body.arrObj.forEach((element) => {
    //   obj.push({
    //     title:
    //       element.title == undefined ? (element.title = "") : element.title,
    //     tradeCategoryId:
    //       element.tradeCategoryId == undefined
    //         ? (element.tradeCategoryId = "")
    //         : element.tradeCategoryId,
    //   });
    // });
    // console.log(obj);
    const responseObj = await JOBTask.insertMany(req.body.arrObj.map(ele => ({ ...ele, userId: req.userId })));
    response.successResponse(res, 200, MESSAGE.JOB_TASK_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_JOB_TASK);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/JOBTask");
//     const result = await commonController.getWithReverseSortByPopulate(
//       JOBTask,
//       "tradeCategoryId"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JOB_TASK);
//   }
// });

// get all JOBTask
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/JOBTask");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getRecordsSortedWithPopulate(
        JOBTask,
        "tradeCategoryId",
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllRecordByPopulate(
        JOBTask,
        "tradeCategoryId",
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JOB_TASK);
  }
});

// get JOBTask
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/JOBTask", req.params.id);
    const result = await commonController.getOne(JOBTask, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JOB_TASK);
  }
});

// update JOBTask
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/JOBTask", req.params.id);
    const result = await commonController.updateBy(
      JOBTask,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.JOB_TASK_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_JOB_TASK + req.params.id
    );
  }
});

// delete JOBTask
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/JOBTask", req.params.id);
    const result = await commonController.delete(JOBTask, req.params.id);
    response.successResponse(res, 200, MESSAGE.JOB_TASK_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_JOB_TASK + req.params.id
    );
  }
});

module.exports = router;
