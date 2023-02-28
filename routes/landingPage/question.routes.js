const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const { result } = require("lodash");
const Question = mongoose.model("Question");

// add question
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/question");
    const data = await commonController.getOne(Question, {
      mode: req.body.mode,
    });
    if (data) {
      const resData = await Question.findOneAndDelete({ mode: req.body.mode });
      const result = await commonController.add(Question, req.body);
      response.successResponse(res, 200, MESSAGE.QUESTION_CREATED + result._id);
    } else {
      const result = await commonController.add(Question, req.body);
      response.successResponse(res, 200, MESSAGE.QUESTION_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_QUESTION);
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/question", req.params.id);
    const result = await commonController.getOne(Question, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_QUESTION);
  }
});

module.exports = router;
