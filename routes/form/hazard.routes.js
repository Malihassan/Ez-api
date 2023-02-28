const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const Hazard = mongoose.model("Hazard");

// add Hazard
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/Hazard");
    const obj = req.body;
    const createdByData = req.designation;
    const clientAdminData = req.clientAdminId;

    const data = await Hazard.find({ updated: "false" })
      .sort({ _id: -1 })
      .limit(1);

    if (data != 0) {
      const index = data[0].formId.split("-")[1];

      const objWithIndex = Object.assign(
        { formId: `WHS_IR-${parseInt(index) + 1}` },
        { createdBy: createdByData },
        { clientAdminId: clientAdminData },
        obj
      );

      const result = await commonController.add(Hazard, objWithIndex);
      response.successResponse(res, 200, MESSAGE.HAZARD_CREATED + result._id);
    } else {
      const objWithIndex = Object.assign(
        { formId: `WHS_IR-${1}` },
        { createdBy: createdByData },
        { clientAdminId: clientAdminData },
        obj
      );

      const result = await commonController.add(Hazard, objWithIndex);
      response.successResponse(res, 200, MESSAGE.HAZARD_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    // response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_HAZARD);
    response.errorMsgResponse(res, 500, error);
  }
});

// get all new records
router.get("/getAllNewRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/Hazard");
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
          Hazard,
          { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
          userData,
          [
            "department",
            "managerSupervisor",
            "compileDepartment",
            "compilePosition",
            "position",
            "myControl",
          ],
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthNewRecordByPopulate(
        Hazard,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData,
        [
          "department",
          "managerSupervisor",
          "compileDepartment",
          "compilePosition",
          "position",
          "myControl",
        ]
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_HAZARD);
  }
});

// get all old records
router.get("/getAllOldRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/Hazard");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAuthOldRecordBySorting(
        Hazard,
        { clientAdminId: req.userId },
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthOldRecord(Hazard, {
        clientAdminId: req.userId,
      });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_HAZARD);
  }
});

// get related old Hazard by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
  try {
    log.debug("/get/Hazard", req.params.id);
    const data = await commonController.getOne(Hazard, {
      _id: req.params.id,
      clientAdminId: req.userId,
    });
    const result = await commonController.getBy(Hazard, {
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
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_HAZARD);
  }
});

// get Hazard
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/Hazard", req.params.id);
    const result = await commonController.getSingleRecordByPopulate(
      Hazard,
      { _id: req.params.id },
      [
        "department",
        "managerSupervisor",
        "compileDepartment",
        "compilePosition",
        "position",
        "myControl",
      ]
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_HAZARD);
  }
});

// update Hazard
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/Hazard", req.params.id);
    const hazardResult = await commonController.getOne(Hazard, {
      _id: req.params.id,
    });

    var obj = Object.assign({ version: hazardResult.version + 1 }, req.body);

    if (hazardResult) {
      let newData = {
        myControl: hazardResult.myControl,
        myControlManager: hazardResult.myControlManager,
        employeeParttime: hazardResult.employeeParttime,
        fullName: hazardResult.fullName,
        email: hazardResult.email,
        phone: hazardResult.phone,
        department: hazardResult.department,
        position: hazardResult.position,
        projectName: hazardResult.projectName,
        managerSupervisor: hazardResult.managerSupervisor,
        managerSupervisorEmail: hazardResult.managerSupervisorEmail,
        whsManagerEmail: hazardResult.whsManagerEmail,
        describeHazard: hazardResult.describeHazard,
        dateHazardReport: hazardResult.dateHazardReport,
        locationHazard: hazardResult.locationHazard,
        dateHazardIdentify: hazardResult.dateHazardIdentify,
        jobNumberId: hazardResult.jobNumberId,
        action: hazardResult.action,
        eliminateHazard: hazardResult.eliminateHazard,
        eliminateCorrect: hazardResult.eliminateCorrect,
        elliminateAction: hazardResult.elliminateAction,
        eliminateWhen: hazardResult.eliminateWhen,
        substituteCorrect: hazardResult.substituteCorrect,
        substituteAction: hazardResult.substituteAction,
        substituteWhen: hazardResult.substituteWhen,
        isolatedCorrect: hazardResult.isolatedCorrect,
        isolatedAction: hazardResult.isolatedAction,
        isolatedWhen: hazardResult.isolatedWhen,
        solutionCorrect: hazardResult.solutionCorrect,
        solutionAction: hazardResult.solutionAction,
        solutionWhen: hazardResult.solutionWhen,
        procedureRemove: hazardResult.procedureRemove,
        procedureRemoveCorrect: hazardResult.procedureRemoveCorrect,
        procedureRemoveAction: hazardResult.procedureRemoveAction,
        procedureRemoveWhen: hazardResult.procedureRemoveWhen,
        PPECorrect: hazardResult.PPECorrect,
        PPEAction: hazardResult.PPEAction,
        PPEWhen: hazardResult.PPEWhen,
        name: hazardResult.name,
        compilePosition: hazardResult.compilePosition,
        compileDepartment: hazardResult.compileDepartment,
        fileUpload: hazardResult.fileUpload,
        date: hazardResult.date,
        signaturePad1: hazardResult.signaturePad1,
        complete: hazardResult.complete,
        consequence: hazardResult.consequence,
        riskRating: hazardResult.riskRating,
        actionRequired: hazardResult.actionRequired,
        likelihood: hazardResult.likelihood,
        reduceRisk: hazardResult.reduceRisk,
        procedures: hazardResult.procedures,
        process: hazardResult.process,
        isolatedHazard: hazardResult.isolatedHazard,
        eliminateHazardAction: hazardResult.eliminateHazardAction,
        refersTo: hazardResult._id,
        clientAdminId: hazardResult.clientAdminId,
        enable: hazardResult.enable,
        frequency: hazardResult.frequency,
        version: hazardResult.version,
        updated: "true",
        createdTime: hazardResult.createdAt.toISOString(),
        updatedTime: hazardResult.updatedAt.toISOString(),
      };
      const data = await commonController.add(Hazard, newData);
    }

    const result = await commonController.updateBy(Hazard, req.params.id, obj);
    response.successResponse(res, 200, MESSAGE.HAZARD_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_TOOLBOX + req.params.id
    );
  }
});

// delete Hazard
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Hazard", req.params.id);
    const result = await commonController.delete(Hazard, req.params.id);
    response.successResponse(res, 200, MESSAGE.HAZARD_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_HAZARD + req.params.id
    );
  }
});

module.exports = router;
