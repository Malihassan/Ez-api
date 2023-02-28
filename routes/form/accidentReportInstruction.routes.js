const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const AccidentReportInstruction = mongoose.model("AccidentReportInstruction");

// add Accident Report Instruction
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/AccidentReportInstruction");
    const data = await AccidentReportInstruction.findOne({ userId: req.userId });
    if (data) {
      const getData = await AccidentReportInstruction.findOneAndDelete({
        _id: data.id,
      });
      const result = await commonController.add(
        AccidentReportInstruction,
        { ...req.body, userId: req.userId }
      );
      response.successResponse(
        res,
        200,
        MESSAGE.ACCIDENT_REPORT_INSTRUCTION_CREATED + result._id
      );
    } else {
      const result = await commonController.add(
        AccidentReportInstruction,
        { ...req.body, userId: req.userId }
      );
      response.successResponse(
        res,
        200,
        MESSAGE.ACCIDENT_REPORT_INSTRUCTION_CREATED + result._id
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_ACCIDENT_REPORT_INSTRUCTION
    );
  }
});

// get all Accident Report Instruction
router.get("/getAll", async (req, res) => {
  try {
    log.debug("/getAll/AccidentReportInstruction");
    const result = await commonController.getAllSortReverse(
      AccidentReportInstruction,
      { userId: req.userId }
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_ACCIDENT_REPORT_INSTRUCTION
    );
  }
});

// delete Accident Report Instruction
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/AccidentReportInstruction", req.params.id);
    const result = await commonController.delete(
      AccidentReportInstruction,
      req.params.id
    );
    response.successResponse(
      res,
      200,
      MESSAGE.ACCIDENT_REPORT_INSTRUCTION_DELETED
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_ACCIDENT_REPORT_INSTRUCTION + req.params.id
    );
  }
});

module.exports = router;
