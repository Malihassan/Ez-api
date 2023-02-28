const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const RegistrationlnCms = mongoose.model("RegistrationlnCms");

// add Registration ln Cms
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/RegistrationlnCms");
    const result = await commonController.add(RegistrationlnCms, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.REGISTRATION_IN_CMS_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_REGISTRATION_IN_CMS
    );
  }
});

// get all Registration ln Cms
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/RegistrationlnCms");
    const result = await commonController.getAll(RegistrationlnCms);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_REGISTRATION_IN_CMS
    );
  }
});

// update Registration ln Cms
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/RegistrationlnCms", req.params.id);
    const result = await commonController.updateBy(
      RegistrationlnCms,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.REGISTRATION_IN_CMS_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_REGISTRATION_IN_CMS + req.params.id
    );
  }
});

// delete Registration ln Cms
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/RegistrationlnCms", req.params.id);
    const result = await commonController.delete(
      RegistrationlnCms,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.REGISTRATION_IN_CMS_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_REGISTRATION_IN_CMS + req.params.id
    );
  }
});

module.exports = router;
