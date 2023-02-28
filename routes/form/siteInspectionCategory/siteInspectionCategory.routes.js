const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const _ = require("lodash");
const mongoose = require("mongoose");
const SiteInspectionCategory = mongoose.model("SiteInspectionCategory");
const SiteInspectionTopic = mongoose.model("SiteInspectionTopic");

// add Site Inspection Category
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/SiteInspectionCategory");
    const result = await commonController.add(SiteInspectionCategory, { ...req.body, userId: req.userId });
    response.successResponse(
      res,
      200,
      MESSAGE.SITE_INSPECTION_CATEGORY_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SITE_INSPECTION_CATEGORY
    );
  }
});

// get all Site Inspection Category
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/SiteInspectionCategory");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        SiteInspectionCategory,
        field,
        value,
        { userId: req.userId }
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(SiteInspectionCategory, { userId: req.userId });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION_CATEGORY
    );
  }
});

// get Site Inspection Category
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/SiteInspectionCategory", req.params.id);
    const result = await commonController.getSingleRecordByPopulate(
      SiteInspectionCategory,
      {
        _id: req.params.id,
      },
      "jobNumber"
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION_CATEGORY
    );
  }
});

// get all topics from Site Inspection Category
router.get("/getAllTopics/:id", async (req, res) => {
  try {
    log.debug("/get/topics/by/siteInspectionCategory");
    const field = req.query.field;
    const value = req.query.value;

    const result = await commonController.getOne(SiteInspectionCategory, {
      _id: req.params.id,
    });
    const data = await commonController.getBy(SiteInspectionTopic, {
      categoryId: result._id,
    });

    if (field && value) {
      const topic = _.orderBy(data, [field], [value]);
      const responseObj = [{ topic }];
      response.successResponse(res, 200, responseObj);
    } else {
      const topic = data;
      const responseObj = [{ topic }];
      response.successResponse(res, 200, responseObj);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION_CATEGORY
    );
  }
});

// update Site Inspection Category
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/SiteInspectionCategory", req.params.id);
    const result = await commonController.updateBy(
      SiteInspectionCategory,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SITE_INSPECTION_CATEGORY_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SITE_INSPECTION_CATEGORY + req.params.id
    );
  }
});

// delete Site Inspection Category
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SiteInspectionCategory", req.params.id);
    const result = await commonController.delete(
      SiteInspectionCategory,
      req.params.id
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SITE_INSPECTION_CATEGORY_DELETED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SITE_INSPECTION_CATEGORY + req.params.id
    );
  }
});

module.exports = router;
