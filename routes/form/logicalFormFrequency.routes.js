const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const LogicalFormFrequency = mongoose.model("LogicalFormFrequency");

// get all Logical Form Frequency
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/LogicalFormFrequency");

    const result = await commonController.getBy(LogicalFormFrequency, {
      clientAdminId: req.userId,
    });

    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_LOGICAL_FORM_FREQUENCY
    );
  }
});

// get LogicalFormFrequency
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/LogicalFormFrequency", req.params.id);
    const result = await commonController.getOne(LogicalFormFrequency, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_LOGICAL_FORM_FREQUENCY
    );
  }
});

// update LogicalFormFrequency
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/LogicalFormFrequency", req.params.id);
    const result = await commonController.updateBy(
      LogicalFormFrequency,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.LOGICAL_FORM_FREQUENCY_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_LOGICAL_FORM_FREQUENCY + req.params.id
    );
  }
});

// delete LogicalFormFrequency
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/LogicalFormFrequency", req.params.id);
    const result = await commonController.delete(
      LogicalFormFrequency,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.LOGICAL_FORM_FREQUENCY_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_LOGICAL_FORM_FREQUENCY + req.params.id
    );
  }
});

module.exports = router;
