const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const auth = require("../../../helper/auth");
const mongoose = require("mongoose");
const Hazard = mongoose.model("Hazard");
const IncidentForm = mongoose.model("IncidentForm");
const RiskAssessment = mongoose.model("RiskAssessment");
const SiteInspection = mongoose.model("SiteInspection");
const ToolBox = mongoose.model("ToolBox");
const SavedDynamicForm = mongoose.model("SavedDynamicForm");
const _ = require("lodash");

// get all Chemical
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/SavedForms");
    if (req.designation == "ClientAdmin") {
      var validData = { clientAdminId: req.userId };
    } else {
      var validData = { userId: req.userId };
    }

    let data = [];

    let hazardResult = await commonController.getAllAuthNewRecord(
      Hazard,
      { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
      validData
    );
    var incidentResult = await commonController.getAllAuthNewRecord(
      IncidentForm,
      { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
      validData
    );
    var riskAssessmentResult = await commonController.getAllAuthNewRecord(
      RiskAssessment,
      { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },

      validData
    );
    var toolBoxResult = await commonController.getAllAuthNewRecord(
      ToolBox,
      { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
      validData
    );
    var siteInspectionResult = await commonController.getAllAuthNewRecord(
      SiteInspection,
      { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },

      validData
    );
    var savedDynamicFormResult = await commonController.getAllAuthNewRecord(
      SavedDynamicForm,
      { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },

      validData
    );

    hazardResult.map((obj) => {
      obj._doc.fileType = "Hazard Report";
    });
    incidentResult.map((obj) => {
      obj._doc.fileType = "Notifiable Accident";
    });
    riskAssessmentResult.map((obj) => {
      obj._doc.fileType = "Risk Assessment";
    });
    toolBoxResult.map((obj) => {
      obj._doc.fileType = "Tool Box";
    });
    siteInspectionResult.map((obj) => {
      obj._doc.fileType = "Site Inspection";
    });
    savedDynamicFormResult.map((obj) => {
      obj._doc.fileType = obj._doc.title;
      obj._doc.isDynamic = "Dynamic Form";
    });

    data.push(
      siteInspectionResult,
      hazardResult,
      incidentResult,
      riskAssessmentResult,
      toolBoxResult,
      savedDynamicFormResult
    );
    const resultObj = data.flat();
    const resultCount = resultObj.length;

    const filters = req.query;

    const booleanRes = _.isEmpty(filters);

    if (booleanRes) {
      response.successResponseCount(res, 200, resultObj, resultCount);
    } else {
      let objectLength = Object.keys(filters).length;

      if (objectLength == 3) {
        let page;
        let limit;
        let first;
        let second;
        for (let key in filters) {
          if (key == "page" || key == "Page") {
            page = filters[key];
          } else if (key == "limit" || key == "Limit") {
            limit = filters[key];
          } else {
            first = key;
            second = filters[key];
          }
        }
        let output = [];

        resultObj.forEach((v, i) => {
          const obj1 = Object.entries(v);
          const obj2 = obj1[5][1];
          // console.log(obj2.createdAt);

          for (let item in obj2) {
            if (item.toLowerCase() === first.toLowerCase()) {
              if (
                ["createdat", "updatedat"].includes(first.toLowerCase()) &&
                item.toLowerCase() === first.toLowerCase()
              ) {
                if (
                  new Date(obj2[item]).toISOString().slice(0, 10) === second
                ) {
                  output.push(v);
                }
              }
              if (
                obj2[item]
                  .toString()
                  .toLowerCase()
                  .includes(second.toString().toLowerCase())
              ) {
                output.push(v);
              }
            }
          }
        });

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = output.slice(startIndex, endIndex);

        response.successResponseCount(res, 200, result, resultCount);
      } else {
        let page = filters.page || filters.Page;
        let limit = filters.limit || filters.Limit;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = resultObj.slice(startIndex, endIndex);

        response.successResponseCount(res, 200, result, resultCount);
      }
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, "unable to fetch data");
  }
});

module.exports = router;
