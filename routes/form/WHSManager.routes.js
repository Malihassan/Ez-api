const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const WHSManager = mongoose.model("WHSManager");

// add WHSManager
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/WHSManager");
    const result = await commonController.add(WHSManager, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.WHS_MANAGER_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_WHS_MANAGER);
  }
});

// add multiple WHSManager
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/WHSManager");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        name: element.name == undefined ? (element.name = "") : element.name,
        email:
          element.email == undefined ? (element.email = "") : element.email,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await WHSManager.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.MULTIPLE_WHS_MANAGER_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_WHS_MANAGER);
  }
});

// get all WHSManager
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/WHSManager");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        WHSManager,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(WHSManager, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_WHS_MANAGER);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/WHSManager");
//     const result = await commonController.getAllRecordSorted(
//       WHSManager,
//       "name"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_WHS_MANAGER);
//   }
// });

// get WHSManager
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/WHSManager", req.params.id);
    const result = await commonController.getOne(WHSManager, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_WHS_MANAGER);
  }
});

// update WHSManager
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/WHSManager", req.params.id);
    const result = await commonController.updateBy(
      WHSManager,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.WHS_MANAGER_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_WHS_MANAGER + req.params.id
    );
  }
});

// delete WHSManager
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/WHSManager", req.params.id);
    const result = await commonController.delete(WHSManager, req.params.id);
    response.successResponse(res, 200, MESSAGE.WHS_MANAGER_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_WHS_MANAGER + req.params.id
    );
  }
});

module.exports = router;
