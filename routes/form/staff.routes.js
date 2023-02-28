const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Staff = mongoose.model("Staff");

// add Staff
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Staff");
    const result = await commonController.add(Staff, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.STAFF_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_STAFF);
  }
});

// add multiple Staff
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/Staff");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await Staff.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.STAFF_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_STAFF);
  }
});

// get all Staff
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Staff");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Staff,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Staff, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_STAFF);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/Staff");
//     const result = await commonController.getAllRecordSorted(Staff, "title");
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_STAFF);
//   }
// });

// get Staff
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Staff", req.params.id);
    const result = await commonController.getOne(Staff, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_STAFF);
  }
});

// update Staff
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Staff", req.params.id);
    const result = await commonController.updateBy(
      Staff,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.STAFF_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_STAFF + req.params.id
    );
  }
});

// delete Staff
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Staff", req.params.id);
    const result = await commonController.delete(Staff, req.params.id);
    response.successResponse(res, 200, MESSAGE.STAFF_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_STAFF + req.params.id
    );
  }
});

module.exports = router;
