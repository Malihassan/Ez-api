const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const mongoose = require("mongoose");
const SiteInspectionTopic = mongoose.model("SiteInspectionTopic");

// add Site Inspection Topic
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/SiteInspectionTopic");
    const result = await commonController.add(SiteInspectionTopic, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.SITE_INSPECTION_TOPIC_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SITE_INSPECTION_TOPIC
    );
  }
});

// add multiple Site Inspection Topic
router.post("/add/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/SiteInspectionTopic");
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        categoryId:
          element.categoryId == undefined
            ? (element.categoryId = "")
            : element.categoryId,
        topic:
          element.topic == undefined ? (element.topic = "") : element.topic,
        item: element.item == undefined ? (element.item = "") : element.item,
        action:
          element.action == undefined ? (element.action = "") : element.action,
      });
    });
    console.log(obj);
    const responseObj = await SiteInspectionTopic.insertMany(obj);
    response.successResponse(
      res,
      200,
      MESSAGE.MULTIPLE_SITE_INSPECTION_TOPIC_CREATED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SITE_INSPECTION_TOPIC
    );
  }
});

// get all Site Inspection Topic
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/SiteInspectionTopic");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAllRecordBySorting(
        SiteInspectionTopic,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAll(SiteInspectionTopic);
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION_TOPIC
    );
  }
});

// get Site Inspection Topic
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/SiteInspectionTopic", req.params.id);
    const result = await commonController.getOne(SiteInspectionTopic, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION_TOPIC
    );
  }
});

// update Site Inspection Topic
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/SiteInspectionTopic", req.params.id);
    const result = await commonController.updateBy(
      SiteInspectionTopic,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SITE_INSPECTION_TOPIC_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SITE_INSPECTION_TOPIC + req.params.id
    );
  }
});

// delete Site Inspection Topic
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SiteInspectionTopic", req.params.id);
    const result = await commonController.delete(
      SiteInspectionTopic,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.SITE_INSPECTION_TOPIC_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SITE_INSPECTION_TOPIC + req.params.id
    );
  }
});

module.exports = router;
