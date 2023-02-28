const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const AboutUs = mongoose.model("AboutUs");
const Team = mongoose.model("Team");

// add AboutUs
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/aboutUs");
    const data = await AboutUs.findOne();
    if (data) {
      const deleteData = await AboutUs.findOneAndDelete({ _id: data._id });
      const result = await commonController.add(AboutUs, req.body);
      response.successResponse(res, 200, MESSAGE.ABOUT_US_CREATED + result._id);
    } else {
      const result = await commonController.add(AboutUs, req.body);
      response.successResponse(res, 200, MESSAGE.ABOUT_US_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_ABOUT_US);
  }
});

// add aboutUs with multiple team
router.post("/multiple", async (req, res) => {
  try {
    log.debug("/add/multiple/aboutUs");
    const reqObj = {
      description: req.body.description,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      desc: req.body.desc,
      fileUrl: req.body.fileUrl,
      subTitle: req.body.subTitle,
    };
    const data = await AboutUs.findOne();
    if (data) {
      const deleteData = await AboutUs.findOneAndDelete({ _id: data._id });
    }
    const result = await commonController.add(AboutUs, reqObj);
    var obj = [];
    req.body.arrObj.forEach((element) => {
      obj.push({
        aboutUsId: result._id,
        title:
          element.title == undefined ? (element.title = "") : element.title,
        imageUrl:
          element.imageUrl == undefined
            ? (element.imageUrl = "")
            : element.imageUrl,
      });
    });
    const resData = await Team.insertMany(obj);
    response.successResponse(res, 200, MESSAGE.ABOUT_US_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_ABOUT_US);
  }
});

// get AboutUs
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/aboutUs", req.params.id);
    const result = await commonController.getOne(AboutUs, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ABOUT_US);
  }
});

// update AboutUs
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/update/aboutUs", req.params.id);
    const result = await commonController.updateBy(
      AboutUs,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.ABOUT_US_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_ABOUT_US + req.params.id
    );
  }
});

// delete AboutUs
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/aboutUs", req.params.id);
    const result = await commonController.delete(AboutUs, req.params.id);
    response.successResponse(res, 200, MESSAGE.ABOUT_US_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_ABOUT_US + req.params.id
    );
  }
});

// get teams based on aboutUs Id
router.get("/getAll", async (req, res) => {
  try {
    // const result = await commonController.getAll(AboutUs);
    const result = await AboutUs.findOne();
    const team = await commonController.getBy(Team, {
      aboutUsId: result._id,
    });
    const responseObj = [
      {
        _id: result.id,
        description: result.description,
        imageUrl: result.imageUrl,
        title: result.title,
        desc: result.desc,
        fileUrl: result.fileUrl,
        subTitle: result.subTitle,
        team,
      },
    ];
    response.successResponse(res, 200, responseObj);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, error);
  }
});

module.exports = router;
