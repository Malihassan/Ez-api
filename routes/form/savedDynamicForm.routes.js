const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const _ = require("lodash");
const mongoose = require("mongoose");
const Form = mongoose.model("Form");
const SavedDynamicForm = mongoose.model("SavedDynamicForm");

// add Saved Dynamic Form
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/SavedDynamicForm");
    const data = await SavedDynamicForm.find({ updated: { $eq: "false" } })
      .sort({ _id: -1 })
      .limit(1);

    const createdByData = req.designation;

    const obj = req.body;
    const str = obj.title;
    const strData = str.toUpperCase().replace(/ /g, "_");
    // const firstLetter = str.split(" ")[0];
    // const secondLetter = str.split(" ")[1];

    // const firstChar = firstLetter.charAt(0).toUpperCase();
    // const secondChar = secondLetter.charAt(0).toUpperCase();

    if (data.length != 0) {
      const index = data[0].formIndex.split("-")[1];

      const objWithIndex = Object.assign(
        { formIndex: `WHS_${strData}-${parseInt(index) + 1}` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(SavedDynamicForm, objWithIndex);
      response.successResponse(
        res,
        200,
        MESSAGE.SAVED_DYNAMIC_FORM_CREATED + result._id
      );
    } else {
      const objWithIndex = Object.assign(
        { formIndex: `WHS_${strData}-1` },
        { createdBy: createdByData },
        obj
      );

      const result = await commonController.add(SavedDynamicForm, objWithIndex);
      response.successResponse(
        res,
        200,
        MESSAGE.SAVED_DYNAMIC_FORM_CREATED + result._id
      );
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_CREATE_SAVED_DYNAMIC_FORM
    );
  }
});

// get all new records
router.get("/getAllNewRecords", auth, async (req, res) => {
  try {
    log.debug("/getAll/SavedDynamicForm");
    const field = req.query.field;
    const value = req.query.value;

    if (req.designation == "User") {
      var userData = { userId: req.userId };
    } else {
      var userData = { clientAdminId: req.userId };
    }

    if (field && value) {
      const result = await commonController.getAuthNewRecordBySorting(
        SavedDynamicForm,
        { createdBy: req.designation == "User" ? "User" : "ClientAdmin" },
        userData,
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllAuthNewRecord(
        SavedDynamicForm,
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
    log.debug("/getAll/SavedDynamicForm");
    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result = await commonController.getAuthOldRecordBySorting(
        SavedDynamicForm,
        { clientAdminId: req.userId },
        field,
        value
      );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAuthOldRecord(SavedDynamicForm, {
        clientAdminId: req.userId,
      });
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_INCIDENT);
  }
});

// get related old Saved Dynamic Form by id
router.get("/getRelatedOldData/:id", auth, async (req, res) => {
  try {
    log.debug("/get/SavedDynamicForm", req.params.id);
    const data = await commonController.getOne(SavedDynamicForm, {
      _id: req.params.id,
      clientAdminId: req.userId,
    });
    const result = await commonController.getBy(SavedDynamicForm, {
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

// get Saved Dynamic Form
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/SavedDynamicForm", req.params.id);
    const result = await commonController.getSingleRecordByPopulate(
      SavedDynamicForm,
      {
        _id: req.params.id,
      },
      ["formId", "formCategoryId"]
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SAVED_DYNAMIC_FORM
    );
  }
});

// get saved dynamic forms based on formId
router.get("/getBy/:formId", auth, async (req, res) => {
  try {
    log.debug("/getAll/from/formId", req.params.formId);
    const formData = await commonController.getOne(Form, {
      _id: req.params.formId,
    });
    console.log(formData);
    const result = await commonController.getAllRelatedNewRecord(
      SavedDynamicForm,
      {
        formId: formData._id,
      }
    );

    const responseObj = [
      {
        _id: formData._id,
        title: formData.title,
        status: formData.status,
        createdAt: formData.createdAt,
        updatedAt: formData.updatedAt,
        result,
      },
    ];

    response.successResponse(res, 200, responseObj);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_FETCH_SAVED_DYNAMIC_FORM
    );
  }
});

// update Saved Dynamic Form
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/SavedDynamicForm", req.params.id);
    const dynamicResult = await commonController.getOne(SavedDynamicForm, {
      _id: req.params.id,
    });

    const obj = Object.assign({ version: dynamicResult.version + 1 }, req.body);

    if (dynamicResult) {
      let newData = {
        formId: dynamicResult.formId,
        title: dynamicResult.title,
        htmlObject: dynamicResult.htmlObject,
        configure: dynamicResult.configure,
        enable: dynamicResult.enable,
        check: dynamicResult.check,
        frequency: dynamicResult.frequency,
        refersTo: dynamicResult._id,
        clientAdminId: dynamicResult.clientAdminId,
        updated: "true",
        version: dynamicResult.version,
        createdTime: dynamicResult.createdAt.toISOString(),
        updatedTime: dynamicResult.updatedAt.toISOString(),
      };
      const data = await commonController.add(SavedDynamicForm, newData);
    }

    const result = await commonController.updateBy(
      SavedDynamicForm,
      req.params.id,
      obj
    );
    response.successResponse(
      res,
      200,
      MESSAGE.SAVED_DYNAMIC_FORM_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_SAVED_DYNAMIC_FORM + req.params.id
    );
  }
});

// delete Saved Dynamic Form
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/SavedDynamicForm", req.params.id);
    const result = await commonController.delete(
      SavedDynamicForm,
      req.params.id
    );
    response.successResponse(res, 200, MESSAGE.SAVED_DYNAMIC_FORM_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_SAVED_DYNAMIC_FORM + req.params.id
    );
  }
});

// // API for checking title duplication
// router.post("/search", async (req, res) => {
//   try {
//     const result = await SavedDynamicForm.find();
//     const dataArr = [];
//     result.map((e) => {
//       dataArr.push(result.title);
//     });

//     console.log(dataArr);
//   } catch (error) {}
// });

module.exports = router;
