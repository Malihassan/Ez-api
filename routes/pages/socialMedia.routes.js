const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const SocialMedia = mongoose.model("SocialMedia");

// add Social Media
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/SocialMedia");
    const result = await commonController.add(SocialMedia, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.SOCIAL_MEDIA_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_SOCIAL_MEDIA);
  }
});

// get all Social Media
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/SocialMedia");
    const result = await commonController.getAll(SocialMedia);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SOCIAL_MEDIA);
  }
});

// get Social Media
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/:id", req.params.id);
    const result = await commonController.getOne(SocialMedia, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SOCIAL_MEDIA);
  }
});

// update Social Media
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/:id", req.params.id);
    const result = await commonController.updateBy(
      SocialMedia,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SOCIAL_MEDIA_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_UPDATE_SOCIAL_MEDIA);
  }
});

// delete Social Media
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/:id", req.params.id);
    const result = await commonController.delete(SocialMedia, req.params.id);
    response.successResponse(res, 200, MESSAGE.SOCIAL_MEDIA_DELETED);
  } catch (error) {
    SOCIALMEDIA;
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SOCIAL_MEDIA + req.params.id
    );
  }
});
module.exports = router;
