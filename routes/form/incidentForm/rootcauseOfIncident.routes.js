const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const mongoose = require("mongoose");
const RootcauseOfIncident = mongoose.model("RootcauseOfIncident");

// add Rootcause Of Incident
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/RootcauseOfIncident");
    const result = await commonController.add(RootcauseOfIncident, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.ROOTCAUSE_OF_INCIDENT_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_ROOTCAUSE_OF_INCIDENT
    );
  }
});

// add multiple Rootcause Of Incident
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/RootcauseOfIncident");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        title:
          element.title == undefined ? (element.title = "") : element.title,
      });
    });
    console.log(obj);
    const responseObj = await RootcauseOfIncident.insertMany(obj);
    response.successResponse(
      res,
      200,
      MESSAGE.MULTIPLE_ROOTCAUSE_OF_INCIDENT_CREATED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_ROOTCAUSE_OF_INCIDENT
    );
  }
});

// get all Rootcause Of Incident
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/RootcauseOfIncident");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        RootcauseOfIncident,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(RootcauseOfIncident, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_ROOTCAUSE_OF_INCIDENT
    );
  }
});

// router.get("/getAll", async (req, res) => {
//   try {
//     log.debug("/getAll/RootcauseOfIncident");
//     const result = await commonController.getAllRecordSorted(
//       RootcauseOfIncident,
//       "title"
//     );
//     response.successResponse(res, 200, result);
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_FETCH_ROOTCAUSE_OF_INCIDENT
//     );
//   }
// });

// get Rootcause Of Incident
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/RootcauseOfIncident", req.params.id);
    const result = await commonController.getOne(RootcauseOfIncident, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_ROOTCAUSE_OF_INCIDENT
    );
  }
});

// update Rootcause Of Incident
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/RootcauseOfIncident", req.params.id);
    const result = await commonController.updateBy(
      RootcauseOfIncident,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.ROOTCAUSE_OF_INCIDENT_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_ROOTCAUSE_OF_INCIDENT + req.params.id
    );
  }
});

// delete Rootcause Of Incident
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/RootcauseOfIncident", req.params.id);
    const result = await commonController.delete(
      RootcauseOfIncident,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.ROOTCAUSE_OF_INCIDENT_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_ROOTCAUSE_OF_INCIDENT + req.params.id
    );
  }
});

module.exports = router;
