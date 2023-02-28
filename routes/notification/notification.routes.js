const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");

// add Notification
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/Notification");
    const result = await commonController.add(Notification, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.NOTIFICATION_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_NOTIFICATION);
  }
});

// get Notification
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Notification", req.params.id);
    const result = await commonController.getOne(Notification, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_NOTIFICATION);
  }
});

// get all Notification
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/Notification");
    const result = await commonController.getAll(Notification);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_NOTIFICATION);
  }
});

// delete Notification
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Notification", req.params.id);
    const result = await commonController.delete(Notification, req.params.id);
    response.successResponse(res, 200, MESSAGE.NOTIFICATION_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_NOTIFICATION + req.params.id
    );
  }
});

module.exports = router;
