const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const auth = require("../../../helper/auth");
const mongoose = require("mongoose");
const IncidentForm = mongoose.model("IncidentForm");

// add Incident Form
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/IncidentForm");
    const obj = req.body;
    const createdByData = req.designation;

    const data = await IncidentForm.find({ updated: "false" })
      .sort({ _id: -1 })
      .limit(1);

    if (data != 0) {
      const index = data[0].formId.split("-")[1];

      const objWithIndex = Object.assign(
        { formId: `WHS_IR-${parseInt(index) + 1}` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(IncidentForm, objWithIndex);
      response.successResponse(res, 200, MESSAGE.INCIDENT_CREATED + result._id);
    } else {
      const objWithIndex = Object.assign(
        { formId: `WHS_IR-${1}` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(IncidentForm, objWithIndex);
      response.successResponse(res, 200, MESSAGE.INCIDENT_CREATED + result._id);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_INCIDENT);
  }
});

// get all new records
router.get("/getAllNewRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/IncidentForm");
    const field = req.query.field;
    const value = req.query.value;

    if (req.designation == "User") {
      var userData = { userId: req.userId };
    } else {
      var userData = { clientAdminId: req.userId };
    }

    if (field && value) {
      const result = await commonController.getAuthNewRecordBySorting(
        IncidentForm,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllAuthNewRecord(
        IncidentForm,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get all old records
router.get("/getAllOldRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/IncidentForm");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAuthOldRecordBySorting(
        IncidentForm,
        { clientAdminId: req.userId },
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthOldRecord(IncidentForm, {
        clientAdminId: req.userId,
      });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get related old IncidentForm by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
  try {
    log.debug("/get/IncidentForm", req.params.id);
    const data = await commonController.getOne(IncidentForm, {
      _id: req.params.id,
      clientAdminId: req.userId,
    });
    const result = await commonController.getBy(IncidentForm, {
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
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get Incident Form
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/IncidentForm", req.params.id);
    const result = await commonController.getOne(IncidentForm, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// update Incident Form

router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/IncidentForm", req.params.id);
    const incidentResult = await commonController.getOne(IncidentForm, {
      _id: req.params.id,
    });

    var obj = Object.assign({ version: incidentResult.version + 1 }, req.body);

    if (incidentResult) {
      let newData = {
        PPE: incidentResult.PPE,
        arrObj: incidentResult.arrObj,
        changes: incidentResult.changes,
        completedDate: incidentResult.completedDate,
        completedDepartment: incidentResult.completedDepartment,
        completedName: incidentResult.completedName,
        completedPosition: incidentResult.completedPosition,
        customerContact: incidentResult.customerContact,
        customerContactPhone: incidentResult.customerContactPhone,
        customerEmail: incidentResult.customerEmail,
        customerName: incidentResult.customerName,
        dateOfFormCompletion: incidentResult.dateOfFormCompletion,
        dateOfTheIncident: incidentResult.dateOfTheIncident,
        department: incidentResult.department,
        file: incidentResult.file,
        incidents: incidentResult.incidents,
        instructions: incidentResult.instructions,
        jobNumber: incidentResult.jobNumber,
        locationOfTheIncident: incidentResult.locationOfTheIncident,
        name: incidentResult.name,
        nameOfWitness: incidentResult.nameOfWitness,
        natureOFIncidents: incidentResult.natureOFIncidents,
        personCompletingForm: incidentResult.personCompletingForm,
        position: incidentResult.position,
        priorIncident: incidentResult.priorIncident,
        priorIncidentText: incidentResult.priorIncidentText,
        projectManager: incidentResult.projectManager,
        projectName: incidentResult.projectName,
        reviewedDate: incidentResult.reviewedDate,
        reviewedDepartment: incidentResult.reviewedDepartment,
        reviewedName: incidentResult.reviewedName,
        reviewedPosition: incidentResult.reviewedPosition,
        rootCauseIncident: incidentResult.rootCauseIncident,
        signaturePad: incidentResult.signaturePad,
        signaturePad1: incidentResult.signaturePad1,
        similarIncident: incidentResult.similarIncident,
        similarIncidentText: incidentResult.similarIncidentText,
        siteName: incidentResult.siteName,
        streetAddress: incidentResult.streetAddress,
        timeOfTheIncident: incidentResult.timeOfTheIncident,
        whyDidtheUnsafeConditonExist:
          incidentResult.whyDidtheUnsafeConditonExist,
        witnessStatement: incidentResult.witnessStatement,
        changesArr: incidentResult.changesArr,
        natureOFIncidentsArr: incidentResult.natureOFIncidentsArr,
        rootCauseIncidentArr: incidentResult.rootCauseIncidentArr,
        incidentsArr: incidentResult.incidentsArr,
        ppeArr: incidentResult.ppeArr,
        allJobNumbersArr: incidentResult.allJobNumbersArr,
        projectMangArr: incidentResult.projectMangArr,
        staffArr: incidentResult.staffArr,
        refersTo: incidentResult._id,
        clientAdminId: incidentResult.clientAdminId,
        enable: incidentResult.enable,
        frequency: incidentResult.frequency,
        updated: "true",
        version: incidentResult.version,
        createdTime: incidentResult.createdAt.toISOString(),
        updatedTime: incidentResult.updatedAt.toISOString(),
      };
      const data = await commonController.add(IncidentForm, newData);
    }

    const result = await commonController.updateBy(
      IncidentForm,
      req.params.id,
      obj
    );
    response.successResponse(
      res,
      200,
      MESSAGE.INCIDENT_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_INCIDENT + req.params.id
    );
  }
});

// delete Incident Form
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/IncidentForm", req.params.id);
    const result = await commonController.delete(IncidentForm, req.params.id);
    response.successResponse(res, 200, MESSAGE.INCIDENT_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_INCIDENT + req.params.id
    );
  }
});

module.exports = router;
