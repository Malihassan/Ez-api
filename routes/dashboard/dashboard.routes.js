const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const Hazard = mongoose.model("Hazard");
const User = mongoose.model("User");
const IncidentForm = mongoose.model("IncidentForm");
const RiskAssessment = mongoose.model("RiskAssessment");
const ToolBox = mongoose.model("ToolBox");
const SiteInspection = mongoose.model("SiteInspection");
const SavedDynamicForm = mongoose.model("SavedDynamicForm");
const TypeOfIncident = mongoose.model("TypeOfIncident");
const NatureOfIncident = mongoose.model("NatureOfIncident");
const SubContractor = mongoose.model("SubContractor");
const CompanyDetail = mongoose.model("CompanyDetail");
const user = mongoose.model("User");


const moment = require('moment');

router.get("/getCount", auth, async (req, res) => {
  try {
    let filter = {};
    if (req.query && req.query.date) {
      filter = {
        $expr: {
          $and: [
            {
              $eq: [
                { $month: "$createdAt" },
                parseInt(moment(req.query.date).format("M")),
              ],
            },
            {
              $eq: [
                { $year: "$createdAt" },
                parseInt(moment(req.query.date).format("YYYY")),
              ],
            },
          ],
        },
      };
    }

    log.debug("/getCount/dashboard/", req.designation);
    let typeOfIncidentData = await commonController.getAll(
      TypeOfIncident,
      filter
    );
    let typeOfIncidentResultArr = [];
    typeOfIncidentData.forEach((e) => {
      typeOfIncidentResultArr.push(e._id);
    });

    let incidentData = await commonController.getAll(NatureOfIncident, filter);
    let natureOfIncidentResultArr = [];
    incidentData.forEach((e) => {
      natureOfIncidentResultArr.push(e._id);
    });

    if (req.designation == "SuperAdmin") {
      let responseObj = {};
      const hazardResult = await commonController.count(Hazard, filter);
      const incidentFormResult = await commonController.count(
        IncidentForm,
        filter
      );
      const riskAssessmentResult = await commonController.count(
        RiskAssessment,
        filter
      );
      const toolBoxResult = await commonController.count(ToolBox, filter);
      const siteInspectionResult = await commonController.count(
        SiteInspection,
        filter
      );
      const savedDynamicFormResult = await commonController.count(
        SavedDynamicForm,
        filter
      );

      let incidentArr = [];
      let natureOfIncidentArr = [];
      const incidentResult = await commonController.getAllNewRecord(
        IncidentForm,
        filter
      );
      incidentResult.forEach((e) => {
        incidentArr.push(e.incidents);
        natureOfIncidentArr.push(e.natureOFIncidents);
      });

      let typeOfIncidentDataArr = typeOfIncidentResultArr.map((e) =>
        commonController.operation(incidentArr, e)
      );
      let natureOfIncidentDataArr = natureOfIncidentResultArr.map((e) =>
        commonController.operation(natureOfIncidentArr, e)
      );

      const typeOfIncidentResult = await Promise.all(typeOfIncidentDataArr);
      const natureOfIncidentResult = await Promise.all(natureOfIncidentDataArr);

      let [
        nearMissCount,
        firstAidCount,
        medicalTreatmentCount,
        lostTimeInjuryCount,
        deathDataCount,
      ] = typeOfIncidentResult;

      let [
        abrasionCount,
        bruiseCount,
        cutsCount,
        illnessCount,
        amputationCount,
        burnCount,
        herniaCount,
        brokenBoneCount,
        otherCount,
        crushingInjuryCount,
        headInjuryCount,
      ] = natureOfIncidentResult;

      responseObj = {
        cards: {
          nearMissCount,
          firstAidCount,
          medicalTreatmentCount,
          lostTimeInjuryCount,
          deathDataCount,
          hazardResult,
          incidentFormResult,
          riskAssessmentResult,
          toolBoxResult,
          siteInspectionResult,
          savedDynamicFormResult,
        },
        barChart: {
          abrasionCount,
          bruiseCount,
          cutsCount,
          illnessCount,
          amputationCount,
          burnCount,
          herniaCount,
          brokenBoneCount,
          otherCount,
          crushingInjuryCount,
          headInjuryCount,
        },
      };
      response.successResponse(res, 200, responseObj);
    } else if (req.designation == "ClientAdmin") {
      let responseObj = {};
      const hazardResult = await commonController.count(Hazard, {
        clientAdminId: req.userId,
        ...filter,
      });
      const incidentFormResult = await commonController.count(IncidentForm, {
        clientAdminId: req.userId,
        ...filter,
      });
      const riskAssessmentResult = await commonController.count(
        RiskAssessment,
        { clientAdminId: req.userId, ...filter }
      );
      const toolBoxResult = await commonController.count(ToolBox, {
        clientAdminId: req.userId,
        ...filter,
      });
      const siteInspectionResult = await commonController.count(
        SiteInspection,
        { clientAdminId: req.userId, ...filter }
      );
      const savedDynamicFormResult = await commonController.count(
        SavedDynamicForm,
        { clientAdminId: req.userId, ...filter }
      );

      let incidentArr = [];
      let natureOfIncidentArr = [];
      const incidentResult = await commonController.getByNewRecords(
        IncidentForm,
        { clientAdminId: req.userId, ...filter }
      );
      incidentResult.forEach((e) => {
        incidentArr.push(e.incidents);
        natureOfIncidentArr.push(e.natureOFIncidents);
      });

      let typeOfIncidentDataArr = []
      try {
        typeOfIncidentDataArr = typeOfIncidentResultArr.map((e) =>
          commonController.operation(incidentArr, e)
        );
      } catch (error) {
        console.log("errr", error)
      }
      let natureOfIncidentDataArr = []


      try {
        natureOfIncidentDataArr = natureOfIncidentResultArr.map((e) =>
          commonController.operation(natureOfIncidentArr, e)
        );
      } catch (error) {
        console.log("errr", error)
      }

      const typeOfIncidentResult = await Promise.all(typeOfIncidentDataArr);
      const natureOfIncidentResult = await Promise.all(natureOfIncidentDataArr);

      let [
        nearMissCount,
        firstAidCount,
        medicalTreatmentCount,
        lostTimeInjuryCount,
        deathDataCount,
      ] = typeOfIncidentResult;
      let [
        abrasionCount,
        bruiseCount,
        cutsCount,
        illnessCount,
        amputationCount,
        burnCount,
        herniaCount,
        brokenBoneCount,
        otherCount,
        crushingInjuryCount,
        headInjuryCount,
      ] = natureOfIncidentResult;

      responseObj = {
        cards: {
          nearMissCount,
          firstAidCount,
          medicalTreatmentCount,
          lostTimeInjuryCount,
          deathDataCount,
          hazardResult,
          incidentFormResult,
          riskAssessmentResult,
          toolBoxResult,
          siteInspectionResult,
          savedDynamicFormResult,
        },
        barChart: {
          abrasionCount,
          bruiseCount,
          cutsCount,
          illnessCount,
          amputationCount,
          burnCount,
          herniaCount,
          brokenBoneCount,
          otherCount,
          crushingInjuryCount,
          headInjuryCount,
        },
      };
      response.successResponse(res, 200, responseObj);
    } else {
      let responseObj = {};

      const hazardResult = await commonController.count(Hazard, {
        userId: req.userId,
        ...filter,
      });
      const incidentFormResult = await commonController.count(IncidentForm, {
        userId: req.userId,
        ...filter,
      });
      const riskAssessmentResult = await commonController.count(
        RiskAssessment,
        { userId: req.userId, ...filter }
      );
      const toolBoxResult = await commonController.count(ToolBox, {
        userId: req.userId,
        ...filter,
      });
      const siteInspectionResult = await commonController.count(
        SiteInspection,
        { userId: req.userId, ...filter }
      );
      const savedDynamicFormResult = await commonController.count(
        SavedDynamicForm,
        { userId: req.userId, ...filter }
      );

      let incidentArr = [];
      let natureOfIncidentsArr = [];
      const incidentResult = await IncidentForm.find({
        userId: req.userId,
        ...filter,
      });
      incidentResult.forEach((e) => {
        incidentArr.push(e.incidents);
        natureOfIncidentsArr.push(e.natureOFIncidents);
      });

      // console.log(
      //   "=======>>>>>>",
      //   incidentFormcorrectiveresult,
      //   "<<<<<<========"
      // );
      let typeOfIncidentDataArr = typeOfIncidentResultArr.map((e) =>
        commonController.operation(incidentArr, e)
      );
      let natureOfIncidentData = natureOfIncidentResultArr.map((e) =>
        commonController.operation(natureOfIncidentsArr, e)
      );

      const typeOfIncidentResult = await Promise.all(typeOfIncidentDataArr);
      const natureOfIncidentResult = await Promise.all(natureOfIncidentData);

      let [
        nearMissCount,
        firstAidCount,
        medicalTreatmentCount,
        lostTimeInjuryCount,
        deathDataCount,
      ] = typeOfIncidentResult;

      let [
        abrasionCount,
        bruiseCount,
        cutsCount,
        illnessCount,
        amputationCount,
        burnCount,
        herniaCount,
        brokenBoneCount,
        otherCount,
        crushingInjuryCount,
        headInjuryCount,
      ] = natureOfIncidentResult;

      // let incidentFormcorrectiveresult =  incidentResult.map(e=>{

      // })

      // console.log("=======>>>>>>", allResult, "<<<<<<========");

      responseObj = {
        cards: {
          nearMissCount,
          firstAidCount,
          medicalTreatmentCount,
          lostTimeInjuryCount,
          deathDataCount,
          hazardResult,
          incidentFormResult,
          riskAssessmentResult,
          toolBoxResult,
          siteInspectionResult,
          savedDynamicFormResult,
        },
        barChart: {
          abrasionCount,
          bruiseCount,
          cutsCount,
          illnessCount,
          amputationCount,
          burnCount,
          herniaCount,
          brokenBoneCount,
          otherCount,
          crushingInjuryCount,
          headInjuryCount,
        },
      };

      // data.forEach((e, i) => {
      //   e.natureOFIncidentsArr.forEach((x) => {
      //     counts[x.title] = (counts[x.title] || 0) + 1;
      //   });
      // });

      response.successResponse(res, 200, responseObj);
    }
  } catch (error) {
    // log.error(error);
    // console.log("erroror", error)
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY);
  }
});

router.get("/get/expiry/dates", auth, async (req, res) => {
  // { clientAdminId: req.userId }
  let conditions = { $or: [{ clientAdminId: req.userId }, { userId: req.userId }] }

  const riskAssessment = await commonController.getAll(SubContractor, conditions);
  const companyDetail = await commonController.getAll(CompanyDetail, conditions);
  const userDetails = await commonController.getAll(user, conditions);

  let data = [];
  riskAssessment.forEach(ele => {
    ele.licenceAndQualifications.forEach(element => {
      if (element.ExpiryDate) {
        data.push({ name: ele.companyName, expdate: element.ExpiryDate, type: element.LicenceName.fullName })
      }
    })
  })
  companyDetail.forEach(ele => {
    ele.plantRegister.plant.forEach(element => {
      if (element.insuranceExpiry) {
        data.push({ name: ele.companyName, expdate: element.insuranceExpiry, type: element.plantName })
      }
    })
    ele.insuranceRegister.insurance.forEach(element => {
      if (element.expiryDate) {
        data.push({ name: ele.companyName, expdate: element.expiryDate, type: element.documentName })
      }
    })
  })


  userDetails.forEach(ele => {
    ele.ppe.PPEArr.forEach(element => {
      if (element.replacementDate) {
        data.push({ name: ele.firstName + ' ' + ele.lastName, expdate: element.replacementDate, type: element.ppeSupplied })
      }
    })
    ele.plant.plantArr.forEach(element => {
      if (element.serviceRenewDate) {
        data.push({ name: ele.firstName + ' ' + ele.lastName, expdate: element.serviceRenewDate, type: element.plantType })
      }
    })
    ele.licence.forEach(element => {
      element.uploadLicence.forEach(element1 => {
        if (element1.ExpiryDate) {
          data.push({ name: ele.firstName + ' ' + ele.lastName, expdate: element1.ExpiryDate, type: element1.LicenceName })
        }
      })
    })
  })

  response.successResponse(res, 200, data);
})

router.get("/get/SavedDynamicForm/list", auth, async (req, res) => {
  let conditions = { $or: [{ clientAdminId: req.userId }, { userId: req.userId }] }
  const savedDynamicForm = await commonController.getAllNewRecordByPopulate(SavedDynamicForm, 'formId', conditions);
  const hazard = await commonController.getAll(Hazard, conditions);
  const incidentForm = await commonController.getAll(IncidentForm, conditions);
  const toolBox = await commonController.getAll(ToolBox, conditions);
  const siteInspection = await commonController.getAll(SiteInspection, conditions);
  const riskAssessment = await commonController.getAll(RiskAssessment, conditions);


  let data = [];
  savedDynamicForm.forEach(ele => {
    if (data.filter(element => (ele.formId && ele.formId._id == element.id)).length > 0) {
      data.forEach(form => {
        if (form.id == ele.formId._id) {
          form['audit'] = ele.formId.title
          form['quantity'] = form.quantity + 1
        }
      })
    } else {
      if (ele.formId && ele.formId.title)
        data.push({ audit: ele.formId.title, quantity: 1, id: ele.formId._id })
    }
  })

  if (hazard.length) {
    data.push({ audit: 'Hazards Reported', quantity: hazard.length })
  }
  if (incidentForm.length) {
    data.push({ audit: 'Accident Report', quantity: incidentForm.length })
  }
  if (toolBox.length) {
    data.push({ audit: 'Toolbox Talk', quantity: toolBox.length })
  }
  if (siteInspection.length) {
    data.push({ audit: 'Site Inspection', quantity: siteInspection.length })
  }
  if (riskAssessment.length) {
    data.push({ audit: 'Risk Assessment and SWMS', quantity: riskAssessment.length })
  }

  response.successResponse(res, 200, data);
})

router.get("/get/jobs/list", auth, async (req, res) => {
  let conditions = { $or: [{ clientAdminId: req.userId }, { userId: req.userId }] }
  const jobsList = await commonController.getAllAuthRecordByPopulate(ToolBox, conditions, 'jobNumberId');
  let data = [];
  jobsList.forEach(ele => {
    if (ele.issues) {
      ele.issues.forEach(element => {
        if (element.topicRes == 'No') {
          data.push({ jobNumber: ele.jobNumberId.jobNumber, id: ele._id, status: element.topicRes, name: element.index, disc: element.topicDisc })
        }
      })
    }
  })
  response.successResponse(res, 200, data);
})

router.get("/get/jobs/list/:id", async (req, res) => {
  let conditions = { jobNumberId: req.params.id }
  const jobsList = await commonController.getAllAuthRecordByPopulate(ToolBox, conditions, 'jobNumberId');
  let data = [];
  jobsList.forEach(ele => {
    if (ele.issues) {
      ele.issues.forEach(element => {
        if (element.topicRes == 'No') {
          data.push(element)
        }
      })
    }
  })
  response.successResponse(res, 200, data);
})


router.get("/get/jobs/update/:id/:name", async (req, res) => {
  let conditions = { _id: req.params.id }
  const jobsList = await commonController.getOne(ToolBox, conditions);
  let data = [];
  jobsList.issues.forEach(ele => {
    if (ele.index == req.params.name) {
      data.push({ ...ele, topicRes: 'Yes' })
    } else {
      data.push(ele)
    }
  })
  await commonController.updateBy(ToolBox, req.params.id, { issues: data })
  response.successResponse(res, 200, data);
})



router.get("/get/corrective/action", auth, async (req, res) => {
  try {
    let conditions = { $or: [{ clientAdminId: req.userId }, { userId: req.userId }] }

    let filter = {};
    if (req.query && req.query.date) {
      filter = {
        $expr: {
          $and: [
            {
              $eq: [
                { $month: "$createdAt" },
                parseInt(moment(req.query.date).format("M")),
              ],
            },
            {
              $eq: [
                { $year: "$createdAt" },
                parseInt(moment(req.query.date).format("YYYY")),
              ],
            },
          ],
        },
      };
    }
    log.debug("/get/dashboard/corrective/action");
    let incidentFormCorr = [];
    const incidentResult = await IncidentForm.find({
      ...conditions,
      ...filter
    }).populate("corrAction.personRes");
    incidentResult.forEach((e) => {
      incidentFormCorr.push(e.corrAction);
    });
    console.log("incidentResultincidentResultincidentResult", incidentResult.length, req.userId)
    const toolboxResult = await ToolBox.find({
      ...conditions,
      ...filter
    }).populate(
      "corrAction.personRes"
    );
    toolboxResult.forEach((e) => {
      incidentFormCorr.push(e.corrAction);
    });

    const siteInspectionResult = await SiteInspection.find({
      ...filter,
      ...conditions,
      status: { $ne: "deleted" },
    }).populate("siteAction.personRes");
    siteInspectionResult.forEach((e) => incidentFormCorr.push(e.siteAction));

    const hazardResult = await Hazard.find({
      ...conditions,
      ...filter
    }).populate([
      "elliminateAction.personRes",
      "substituteAction.personRes",
      "isolatedAction.personRes",
      "solutionAction.personRes",
      "procedureRemoveAction.personRes",
      "PPEAction.personRes",
    ]);
    hazardResult.forEach((e) => {
      incidentFormCorr.push([
        e.elliminateAction,
        e.substituteAction,
        e.isolatedAction,
        e.solutionAction,
        e.procedureRemoveAction,
        e.PPEAction,
      ]);
    });

    let result = []
    incidentFormCorr.forEach(ele => {
      result.push(...ele)
    })
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY);
  }
});



router.put("/update/correctiveAction", auth, async (req, res) => {
  try {
    log.debug("/update/dashboard/correctiveAction");
    let result;
    switch (req.body.formName) {
      case "Toolbox":
        let toolboxData = await commonController.getOne(ToolBox, {
          "corrAction._id": req.body._id,
        });
        toolboxData.corrAction.map((item) => {
          if (item._id == req.body._id) item.completed = true;
          return item;
        });
        result = await ToolBox.updateOne(
          { "corrAction._id": req.body._id },
          { corrAction: toolboxData.corrAction }
        );
        break;

      case "Accident":
        let incidentData = await commonController.getOne(IncidentForm, {
          "corrAction._id": req.body._id,
        });
        incidentData.corrAction.map((item) => {
          if (item._id == req.body._id) item.completed = true;
          return item;
        });
        result = await IncidentForm.updateOne(
          { "corrAction._id": req.body._id },
          { corrAction: incidentData.corrAction }
        );
        break;

      case "Site Inspection":
        let siteInspectionData = await commonController.getOne(SiteInspection, {
          "siteAction._id": req.body._id,
        });
        siteInspectionData.siteAction.map((item) => {
          if (item._id == req.body._id) item.completed = true;
          return item;
        });
        result = await SiteInspection.updateOne(
          { "siteAction._id": req.body._id },
          { siteAction: siteInspectionData.siteAction }
        );
        break;
    }
    // const toolBoxResult = await commonController.updateBy(ToolBox);
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY);
  }
});

module.exports = router;
