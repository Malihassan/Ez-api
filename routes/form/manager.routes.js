const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Manager = mongoose.model("Manager");

// add Manager
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Manager");
    const result = await commonController.add(Manager, { ...req.body, userId: req.userId });
    response.successResponse(res, 200, MESSAGE.MANAGER_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_MANAGER);
  }
});

// add multiple Manager
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/Manager");
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
    const responseObj = await Manager.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.MULTIPLE_MANAGER_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_MANAGER);
  }
});

// get all Manager
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Manager");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Manager,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Manager, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MANAGER);
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/Manager");
//     const result = await commonController.getAllRecordSorted(Manager, "name");
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MANAGER);
//   }
// });

// get Manager
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Manager", req.params.id);
    const result = await commonController.getOne(Manager, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_MANAGER);
  }
});

// update Manager
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Manager", req.params.id);
    const result = await commonController.updateBy(
      Manager,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.MANAGER_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_MANAGER + req.params.id
    );
  }
});

// delete Manager
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Manager", req.params.id);
    const result = await commonController.delete(Manager, req.params.id);
    response.successResponse(res, 200, MESSAGE.MANAGER_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_MANAGER + req.params.id
    );
  }
});

module.exports = router;
