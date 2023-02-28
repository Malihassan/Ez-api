const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const mongoose = require("mongoose");
const TypeOfIncident = mongoose.model("TypeOfIncident");

// add Type Of Incident
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/TypeOfIncident");
    const result = await commonController.add(TypeOfIncident, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.TYPE_OF_INCIDENT_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_TYPE_OF_INCIDENT
    );
  }
});

// add multiple Type Of Incident
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/TypeOfIncident");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await TypeOfIncident.insertMany(obj);
    response.successResponse(
      res,
      200,
      MESSAGE.MULTIPLE_TYPE_OF_INCIDENT_CREATED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_TYPE_OF_INCIDENT
    );
  }
});

// get all Type Of Incident
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/TypeOfIncident");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        TypeOfIncident,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(TypeOfIncident, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_TYPE_OF_INCIDENT
    );
  }
});

// get Type Of Incident
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/TypeOfIncident", req.params.id);
    const result = await commonController.getOne(TypeOfIncident, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_TYPE_OF_INCIDENT
    );
  }
});

// update Type Of Incident
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/TypeOfIncident", req.params.id);
    const result = await commonController.updateBy(
      TypeOfIncident,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.TYPE_OF_INCIDENT_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_TYPE_OF_INCIDENT + req.params.id
    );
  }
});

// delete Type Of Incident
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/TypeOfIncident", req.params.id);
    const result = await commonController.delete(TypeOfIncident, req.params.id);
    response.successResponse(res, 200, MESSAGE.TYPE_OF_INCIDENT_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_TYPE_OF_INCIDENT + req.params.id
    );
  }
});

module.exports = router;
