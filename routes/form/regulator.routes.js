const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Regulator = mongoose.model("Regulator");
const auth = require("../../helper/auth");

// add Regulator
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/Regulator");
    req.body['userId'] = req.userId;
    const result = await commonController.add(Regulator, req.body);
    response.successResponse(res, 200, MESSAGE.REGULATOR_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_REGULATOR);
  }
});

// add multiple Regulator
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/Regulator");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await Regulator.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.REGULATOR_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_REGULATOR);
  }
});

// get all Regulator
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/Regulator");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Regulator,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Regulator, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_REGULATOR);
  }
});

// get Regulator
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Regulator", req.params.id);
    const result = await commonController.getOne(Regulator, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_REGULATOR);
  }
});

// update Regulator
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Regulator", req.params.id);
    const result = await commonController.updateBy(
      Regulator,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.REGULATOR_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_REGULATOR + req.params.id
    );
  }
});

// delete Regulator
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Regulator", req.params.id);
    const result = await commonController.delete(Regulator, req.params.id);
    response.successResponse(res, 200, MESSAGE.REGULATOR_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_REGULATOR + req.params.id
    );
  }
});

module.exports = router;
