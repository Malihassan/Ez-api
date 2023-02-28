const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Jurisdiction = mongoose.model("Jurisdiction");
const auth = require("../../helper/auth");

// add Jurisdiction
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/Jurisdiction");
    req.body['userId'] = req.userId
    const result = await commonController.add(Jurisdiction, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.JURISDICTION_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_JURISDICTION);
  }
});

// add multiple Jurisdiction
router.post("/add/multiple", auth, async (req, res) => {
  try {
    log.debug("/add/multiple/Jurisdiction");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await Jurisdiction.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.JURISDICTION_CREATED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_JURISDICTION);
  }
});

// get all Jurisdiction
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/Jurisdiction");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        Jurisdiction,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(Jurisdiction, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JURISDICTION);
  }
});

// get Jurisdiction
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Jurisdiction", req.params.id);
    const result = await commonController.getOne(Jurisdiction, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_JURISDICTION);
  }
});

// update Jurisdiction
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/Jurisdiction", req.params.id);
    const result = await commonController.updateBy(
      Jurisdiction,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.JURISDICTION_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_JURISDICTION + req.params.id
    );
  }
});

// delete Jurisdiction
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Jurisdiction", req.params.id);
    const result = await commonController.delete(Jurisdiction, req.params.id);
    response.successResponse(res, 200, MESSAGE.JURISDICTION_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_JURISDICTION + req.params.id
    );
  }
});

module.exports = router;
