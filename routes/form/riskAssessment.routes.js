const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const RiskAssessment = mongoose.model("RiskAssessment");

// add Risk Assessment
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/RiskAssessment");
    const obj = req.body;

    const createdByData = req.designation;

    const data = await RiskAssessment.find({ updated: "false" })
      .sort({ _id: -1 })
      .limit(1);

    if (data != 0) {
      const index = data[0].formId.split("-")[1];

      const objWithIndex = Object.assign(
        { formId: `WHS_RA-${parseInt(index) + 1}` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(RiskAssessment, { ...objWithIndex, userId: req.userId });
      response.successResponse(
        res,
        200,
        MESSAGE.RISK_ASSESSMENT_CREATED + result._id
      );
    } else {
      const objWithIndex = Object.assign(
        { formId: `WHS_RA-${1}` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(RiskAssessment, { ...objWithIndex, userId: req.userId });
      response.successResponse(
        res,
        200,
        MESSAGE.RISK_ASSESSMENT_CREATED + result._id
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_RISK_ASSESSMENT
    );
  }
});

// get all new Risk Assessment records
router.get("/getAllNewRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/RiskAssessment");
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
          RiskAssessment,
          { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
          userData,
          ["employee1", "employeeList.employeeId"],
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthNewRecordByPopulate(
        RiskAssessment,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData,
        ["employee1", "employeeList.employeeId"]
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get all old Risk Assessment records
router.get("/getAllOldRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/RiskAssessment");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result =
        await commonController.getAuthOldRecordBySortingAndPopulate(
          RiskAssessment,
          { clientAdminId: req.userId },
          ["employee1", "employeeList.employeeId"],
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthOldRecordByPopulate(
        RiskAssessment,
        { clientAdminId: req.userId },
        ["employee1", "employeeList.employeeId"]
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get related old Risk Assessment by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
  try {
    log.debug("/get/RiskAssessment", req.params.id);
    const data = await commonController.getOne(RiskAssessment, {
      _id: req.params.id,
      clientAdminId: req.userId,
    });
    const result = await commonController.getByPopulate(
      RiskAssessment,
      {
        refersTo: data._id,
      },
      ["employee1", "employeeList.employeeId"]
    );
    const arrResult = [
      {
        result,
      },
    ];
    response.successResponse(res, 200, arrResult);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get Risk Assessment
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/RiskAssessment", req.params.id);
    const result = await commonController.getSingleRecordByPopulate(
      RiskAssessment,
      { _id: req.params.id },
      ["employee1", "employeeList.employeeId"]
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_RISK_ASSESSMENT
    );
  }
});

// update Risk Assessment
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/RiskAssessment");
    const riskAssistmentResult = await commonController.getOne(RiskAssessment, {
      _id: req.params.id,
    });

    const obj = Object.assign(
      { version: riskAssistmentResult.version + 1 },
      req.body
    );
    if (riskAssistmentResult) {
      let newData = {
        codeOfPract: riskAssistmentResult.codeOfPract,
        employee1: riskAssistmentResult.employee1,
        employee2: riskAssistmentResult.employee2,
        SDSRegister: riskAssistmentResult.SDSRegister,
        SWMSTab: riskAssistmentResult.SWMSTab,
        custConct: riskAssistmentResult.custConct,
        custConctPh: riskAssistmentResult.custConctPh,
        custEmail: riskAssistmentResult.custEmail,
        customerName: riskAssistmentResult.customerName,
        date: riskAssistmentResult.date,
        dateTime: riskAssistmentResult.dateTime,
        editor: riskAssistmentResult.editor,
        expiryDate: riskAssistmentResult.expiryDate,
        file: riskAssistmentResult.file,
        hazardous: riskAssistmentResult.hazardous,
        jobNumber: riskAssistmentResult.jobNumber,
        jurisdiction: riskAssistmentResult.jurisdiction,
        location: riskAssistmentResult.location,
        persResp: riskAssistmentResult.persResp,
        projectManager: riskAssistmentResult.projectManager,
        projectManagerSWMS: riskAssistmentResult.projectManagerSWMS,
        qty: riskAssistmentResult.qty,
        regulator: riskAssistmentResult.regulator,
        residualRisk: riskAssistmentResult.residualRisk,
        riskLevel: riskAssistmentResult.riskLevel,
        safetyLeg: riskAssistmentResult.safetyLeg,
        siteName: riskAssistmentResult.siteName,
        statesSWMS: riskAssistmentResult.statesSWMS,
        streetAddr: riskAssistmentResult.streetAddr,
        streetNo: riskAssistmentResult.streetNo,
        suburb: riskAssistmentResult.suburb,
        town: riskAssistmentResult.town,
        signature1: riskAssistmentResult.signature1,
        signature2: riskAssistmentResult.signature2,
        jobTask: riskAssistmentResult.jobTask,
        riskConstruction: riskAssistmentResult.riskConstruction,
        PPEselection: riskAssistmentResult.PPEselection,
        licence: riskAssistmentResult.licence,
        PPESelection2: riskAssistmentResult.PPESelection2,
        riskConstruction2: riskAssistmentResult.riskConstruction2,
        identifyHazards: riskAssistmentResult.identifyHazards,
        jobTaskDataArr: riskAssistmentResult.jobTaskDataArr,
        PPEselectionArr: riskAssistmentResult.PPEselectionArr,
        highRiskConstructionArr: riskAssistmentResult.highRiskConstructionArr,
        licenseAndQualificationArr:
          riskAssistmentResult.licenseAndQualificationArr,
        projectMangArr: riskAssistmentResult.projectMangArr,
        allJobNumbersArr: riskAssistmentResult.allJobNumbersArr,
        resiRiskLevelArr: riskAssistmentResult.resiRiskLevelArr,
        staffArr: riskAssistmentResult.staffArr,
        riskLevelArr: riskAssistmentResult.riskLevelArr,
        allChemicalsArr: riskAssistmentResult.allChemicalsArr,
        allHazardsArr: riskAssistmentResult.allHazardsArr,
        allContrlActReqArr: riskAssistmentResult.allContrlActReqArr,
        regulatorDataArr: riskAssistmentResult.regulatorDataArr,
        safetyArr: riskAssistmentResult.safetyArr,
        statesArr: riskAssistmentResult.statesArr,
        JurisdictionDataArr: riskAssistmentResult.JurisdictionDataArr,
        employeeList: riskAssistmentResult.employeeList,
        refersTo: riskAssistmentResult._id,
        clientAdminId: riskAssistmentResult.clientAdminId,
        enable: riskAssistmentResult.enable,
        frequency: riskAssistmentResult.frequency,
        updated: "true",
        version: riskAssistmentResult.version,
        createdTime: riskAssistmentResult.createdAt.toISOString(),
        updatedTime: riskAssistmentResult.updatedAt.toISOString(),
      };
      const data = await commonController.add(RiskAssessment, newData);
    }

    const result = await commonController.updateBy(
      RiskAssessment,
      req.params.id,
      obj
    );
    response.successResponse(
      res,
      200,
      MESSAGE.RISK_ASSESSMENT_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_RISK_ASSESSMENT + req.params.id
    );
  }
});

// delete Risk Assessment
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/RiskAssessment", req.params.id);
    const result = await commonController.delete(RiskAssessment, req.params.id);
    response.successResponse(res, 200, MESSAGE.RISK_ASSESSMENT_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_RISK_ASSESSMENT + req.params.id
    );
  }
});

module.exports = router;
