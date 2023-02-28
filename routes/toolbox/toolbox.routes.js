const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const ToolBox = mongoose.model("ToolBox");

// add Tool Box
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/ToolBox");
    const obj = req.body;
    const createdByData = req.designation;
    const data = await ToolBox.find({ updated: "false" })
      .sort({ _id: -1 })
      .limit(1);

    if (data != 0) {
      const index = data[0].formId.split("-")[1];
      const objectWithIndex = Object.assign(
        { formId: `WHS_TB-${parseInt(index) + 1}` },
        { createdBy: createdByData },
        obj
      );
      const result = await commonController.add(ToolBox, objectWithIndex);
      response.successResponse(res, 200, MESSAGE.TOOLBOX_CREATED + result._id);
    } else {
      const objectWithIndex = Object.assign(
        { formId: `WHS_TB-${1}` },
        { createdBy: createdByData },
        obj
      );
      const result = await commonController.add(ToolBox, objectWithIndex);
      response.successResponse(res, 200, MESSAGE.TOOLBOX_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_TOOLBOX);
  }
});

//  get all new toolbox
router.get("/getAllNewRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/ToolBox");
    const field = req.query.field;
    const value = req.query.value;

    if (req.designation == "User") {
      var userData = { userId: req.userId };
    } else {
      var userData = { clientAdminId: req.userId };
    }

    if (field && value) {
      const result = await commonController.getAuthNewRecordBySorting(
        ToolBox,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllAuthNewRecord(
        ToolBox,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TOOLBOX);
  }
});

// get all old records
router.get("/getAllOldRecords", async (req, res) => {
  try {
    log.debug("/getAll/ToolBox");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAuthOldRecordBySorting(
        ToolBox,
        { clientAdminId: req.userId },
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthOldRecord(ToolBox, {
        clientAdminId: req.userId,
      });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TOOLBOX);
  }
});

// get Tool Box
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/ToolBox", req.params.id);
    const result = await commonController.getOne(ToolBox, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TOOLBOX);
  }
});

// get related old toolbox by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
  try {
    log.debug("/get/TOOLBOX", req.params.id);
    const data = await commonController.getOne(ToolBox, {
      _id: req.params.id,
      clientAdminId: req.userId,
    });
    const result = await commonController.getBy(ToolBox, {
      refersTo: data._id,
    });
    const arrResult = [
      {
        result,
      },
    ];
    response.successResponse(res, 200, arrResult);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_TOOLBOX);
  }
});

// update toolbox
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/ToolBox", req.params.id);
    const toolBoxResult = await commonController.getOne(ToolBox, {
      _id: req.params.id,
    });

    let obj = Object.assign({ version: toolBoxResult.version + 1 }, req.body);

    if (toolBoxResult) {
      let newData = {
        refersTo: toolBoxResult._id,
        jobNumberId: toolBoxResult.jobNumberId,
        customerName: toolBoxResult.customerName,
        custEmail: toolBoxResult.custEmail,
        custConct: toolBoxResult.custConct,
        custConctPh: toolBoxResult.custConctPh,
        siteName: toolBoxResult.siteName,
        streetAddr: toolBoxResult.streetAddr,
        signaturePad1: toolBoxResult.signaturePad1,
        date: toolBoxResult.data,
        attendees: toolBoxResult.attendees,
        corrAction: toolBoxResult.corrAction,
        issues: toolBoxResult.issues,
        dateTooboxTalk: toolBoxResult.dateTooboxTalk,
        meetingBy: toolBoxResult.meetingBy,
        personResponsible: toolBoxResult.personResponsible,
        enable: toolBoxResult.enable,
        frequency: toolBoxResult.frequency,
        updated: "true",
        version: toolBoxResult.version,
        clientAdminId: toolBoxResult.clientAdminId,
        createdTime: toolBoxResult.createdAt.toISOString(),
        updatedTime: toolBoxResult.updatedAt.toISOString(),
      };
      const data = await commonController.add(ToolBox, newData);
    }

    const result = await commonController.updateBy(ToolBox, req.params.id, obj);
    response.successResponse(res, 200, MESSAGE.TOOLBOX_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_TOOLBOX + req.params.id
    );
  }
});

// delete Tool Box
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/ToolBox", req.params.id);
    const result = await commonController.delete(ToolBox, req.params.id);
    response.successResponse(res, 200, MESSAGE.TOOLBOX_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_TOOLBOX + req.params.id
    );
  }
});

module.exports = router;
