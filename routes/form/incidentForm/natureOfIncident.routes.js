const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const mongoose = require("mongoose");
const NatureOfIncident = mongoose.model("NatureOfIncident");

// add Nature Of Incident
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/NatureOfIncident");
    const result = await commonController.add(NatureOfIncident, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.NATURE_OF_INCIDENT_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_NATURE_OF_INCIDENT
    );
  }
});

// add multiple Nature Of Incident
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/NatureOfIncident");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
        userId: req.userId
      });
    });
    console.log(obj);
    const responseObj = await NatureOfIncident.insertMany(obj);
    response.successResponse(
      res,
      200,
      MESSAGE.MULTIPLE_NATURE_OF_INCIDENT_CREATED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_NATURE_OF_INCIDENT
    );
  }
});

// get all Nature Of Incident
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/NatureOfIncident");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        NatureOfIncident,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(NatureOfIncident, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_NATURE_OF_INCIDENT
    );
  }
});

// get Nature Of Incident
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/NatureOfIncident", req.params.id);
    const result = await commonController.getOne(NatureOfIncident, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_NATURE_OF_INCIDENT
    );
  }
});

// update Nature Of Incident
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/NatureOfIncident", req.params.id);
    const result = await commonController.updateBy(
      NatureOfIncident,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.NATURE_OF_INCIDENT_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_NATURE_OF_INCIDENT + req.params.id
    );
  }
});

// delete Nature Of Incident
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/NatureOfIncident", req.params.id);
    const result = await commonController.delete(
      NatureOfIncident,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.NATURE_OF_INCIDENT_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_NATURE_OF_INCIDENT + req.params.id
    );
  }
});

module.exports = router;
