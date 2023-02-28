const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const _ = require("lodash");
const mongoose = require("mongoose");
const SiteInspection = mongoose.model("SiteInspection");

// add Site Inspection
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/SiteInspection");
    const obj = req.body;
    const createdByData = req.designation;
    const data = await SiteInspection.find({ updated: "false" })
      .sort({ _id: -1 })
      .limit(1);
    if (data != 0) {
      const index = data[0].formId.split("-")[1];
      const objWithIndex = Object.assign(
        { formId: `WHS_SI-${parseInt(index) + 1}` },
        { createdBy: createdByData },
        obj
      );
      const result = await commonController.add(SiteInspection, objWithIndex);
      response.successResponse(
        res,
        200,
        MESSAGE.SITE_INSPECTION_CREATED + result._id
      );
    } else {
      const objWithIndex = Object.assign(
        { formId: `WHS_SI-${1}` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(SiteInspection, objWithIndex);
      response.successResponse(
        res,
        200,
        MESSAGE.SITE_INSPECTION_CREATED + result._id
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SITE_INSPECTION
    );
  }
});

// get all new records
router.get("/getAllNewRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/SiteInspection");
    const field = req.query.field;
    const value = req.query.value;

    if (req.designation == "User") {
      var userData = { userId: req.userId };
    } else {
      var userData = { clientAdminId: req.userId };
    }

    if (field && value) {
      const result =
        await commonController.getAuthNewRecordBySortingAndPopulate(
          SiteInspection,
          { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
          userData,
          ["empName", "siteAction.personResponsible"],
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthNewRecordByPopulate(
        SiteInspection,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData,
        ["empName", "siteAction.personResponsible"]
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION
    );
  }
});

// get all old records
router.get("/getAllOldRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/SiteInspection");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result =
        await commonController.getAuthOldRecordBySortingAndPopulate(
          SiteInspection,
          { clientAdminId: req.userId },
          ["empName", "siteAction.personResponsible"],
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthOldRecordByPopulate(
        SiteInspection,
        { clientAdminId: req.userId },
        ["empName", "siteAction.personResponsible"]
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION
    );
  }
});

// get related old SiteInspection by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
  try {
    log.debug("/get/SiteInspection", req.params.id);
    const data = await commonController.getOne(SiteInspection, {
      _id: req.params.id,
      clientAdminId: req.userId,
    });
    const result = await commonController.getByPopulate(
      SiteInspection,
      {
        refersTo: data._id,
      },
      ["empName", "siteAction.personResponsible"]
    );
    const arrResult = [
      {
        result,
      },
    ];
    response.successResponse(res, 200, arrResult);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION
    );
  }
});

// get Site Inspection
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/SiteInspection", req.params.id);
    const result = await commonController.getSingleRecordByPopulate(
      SiteInspection,
      { _id: req.params.id },
      ["empName", "siteAction.personResponsible"]
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SITE_INSPECTION
    );
  }
});

// update Site Inspection

router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/SiteInspection");
    const siteInspectionResult = await commonController.getOne(SiteInspection, {
      _id: req.params.id,
    });
    const obj = Object.assign(
      { version: siteInspectionResult.version + 1 },
      req.body
    );

    if (siteInspectionResult) {
      let newData = {
        allJobNumbersArr: siteInspectionResult.allJobNumbersArr,
        allTopic: siteInspectionResult.allTopic,
        allcategory: siteInspectionResult.allcategory,
        custConct: siteInspectionResult.custConct,
        custConctPh: siteInspectionResult.custConctPh,
        custEmail: siteInspectionResult.custEmail,
        customerName: siteInspectionResult.customerName,
        date: siteInspectionResult.date,
        jobNumber: siteInspectionResult.jobNumber,
        projectManager: siteInspectionResult.projectManager,
        projectMangArr: siteInspectionResult.projectMangArr,
        siteAction: siteInspectionResult.siteAction,
        siteCategorytTopic: siteInspectionResult.siteCategorytTopic,
        siteName: siteInspectionResult.siteName,
        staffArr: siteInspectionResult.staffArr,
        streetAddr: siteInspectionResult.streetAddr,
        empName: siteInspectionResult.empName,
        submitDate: siteInspectionResult.submitDate,
        signature: siteInspectionResult.signature,
        refersTo: siteInspectionResult._id,
        clientAdminId: siteInspectionResult.clientAdminId,
        enable: siteInspectionResult.enable,
        frequency: siteInspectionResult.frequency,
        updated: "true",
        version: siteInspectionResult.version,
        createdTime: siteInspectionResult.createdAt.toISOString(),
        updatedTime: siteInspectionResult.updatedAt.toISOString(),
      };
      const data = await commonController.add(SiteInspection, newData);
    }

    const result = await commonController.updateBy(
      SiteInspection,
      req.params.id,
      obj
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SITE_INSPECTION_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SITE_INSPECTION + req.params.id
    );
  }
});

// delete Site Inspection
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SiteInspection", req.params.id);
    const result = await commonController.delete(SiteInspection, req.params.id);
    response.successResponse(res, 200, MESSAGE.SITE_INSPECTION_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SITE_INSPECTION + req.params.id
    );
  }
});

module.exports = router;
