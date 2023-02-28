const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const SubscriptionCms = mongoose.model("SubscriptionCms");

// add Subscription Cms
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/SubscriptionCms");
    const result = await commonController.add(SubscriptionCms, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.SUBSCRIPTION_CMS_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SUBSCRIPTION_CMS
    );
  }
});

// get all Subscription Cms
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/SubscriptionCms");
    const result = await commonController.getAll(SubscriptionCms);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SUBSCRIPTION_CMS
    );
  }
});

// update Subscription Cms
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/SubscriptionCms", req.params.id);
    const result = await commonController.updateBy(
      SubscriptionCms,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SUBSCRIPTION_CMS_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SUBSCRIPTION_CMS + req.params.id
    );
  }
});

// delete Subscription Cms
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SubscriptionCms", req.params.id);
    const result = await commonController.delete(
      SubscriptionCms,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.SUBSCRIPTION_CMS_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SUBSCRIPTION_CMS + req.params.id
    );
  }
});

module.exports = router;
