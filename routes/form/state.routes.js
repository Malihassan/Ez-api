const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const State = mongoose.model("State");
const auth = require("../../helper/auth");

// add State
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/State");
    req.body['userId'] = req.userId;
    const result = await commonController.add(State, req.body);
    response.successResponse(res, 200, MESSAGE.STATE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_STATE);
  }
});

// get all State
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/State");

    const result = await commonController.getWithReverseSortByPopulate(State, [
      "safetyLegislationId",
      "jurisdictionId",
      "regulatorId",
    ], { $or: [{ userId: req.userId }, { userId: req.adminId }] });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_STATE);
  }
});

// get State
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/State");
    const result = await commonController.getOne(State, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_STATE);
  }
});

// update State
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/State");
    const result = await commonController.updateBy(
      State,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.STATE_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_STATE + req.params.id
    );
  }
});

// delete State
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/State");
    const result = await commonController.delete(State, req.params.id);
    response.successResponse(res, 200, MESSAGE.STATE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_STATE + req.params.id
    );
  }
});

module.exports = router;
