const router = require("express").Router();
const commonController = require("../../../controller/commonController");
const response = require("../../../helper/response");
const MESSAGE = require("../../../helper/message");
const log = require("../../../helper/logger");
const auth = require("../../../helper/auth");
const mongoose = require("mongoose");
const plantReturnModel = require("../../../model/return/plantReturn/plantReturn.model");
const PlantReturn = mongoose.model("PlantReturn");
const PPEReturn = mongoose.model("PPEReturn");
const User = mongoose.model("User");

// add plant return
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/PlantReturn");
    const result = await commonController.add(PlantReturn, req.body);
    response.successResponse(
      res,
      200,
      MESSAGE.PLAN_RETURN_CREATED + result._id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_PLAN_RETURN);
  }
});

//get all plant return
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/PlantReturn");

    if (req.designation == "ClientAdmin") {
      var validData = { clientAdminId: req.userId };
    } else {
      var validData = { userId: req.userId };
    }

    const field = req.query.field;
    const value = req.query.value;
    if (field && value) {
      const result =
        await commonController.getAuthNewRecordBySortingAndPopulate(
          PlantReturn,
          validData,
          "employeeId",
          field,
          value
        );
      response.successResponse(res, 200, result);
    } else {
      const result = await commonController.getAllAuthRecordByPopulate(
        PlantReturn,
        validData,
        "employeeId"
      );
      response.successResponse(res, 200, result);
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PLAN_RETURN);
  }
});

// get plant return
router.get("/get/:id", auth, async (req, res) => {
  try {
    log.debug("/get/PlantReturn", req.params.id);
    const result = await commonController.getOne(PlantReturn, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_PLAN_RETURN);
  }
});

// get all Plant and PPE
router.get("/getPlantAndPPE", auth, async (req, res) => {
  try {
    log.debug("/getPlantAndPPE");
    // let field = req.query.field;
    // var value = req.query.value;

    if (req.designation == "ClientAdmin") {
      var validData = { clientAdminId: req.userId };
    } else {
      var validData = { userId: req.userId };
    }

    const palntResult = await commonController.getAllAuthRecordByPopulate(
      PlantReturn,
      validData,
      "managerName"
    );
    const ppeResult = await commonController.getAllAuthRecordByPopulate(
      PPEReturn,
      validData,
      "managerName"
    );
    const resultArr = [ppeResult, palntResult];
    const result = resultArr.flat();

    // if ((value = 1)) {
    //   result.sort((x, y) => {
    //     let a = x.field;
    //     let b = y.field;
    //     return a - b;
    //   });
    //   console.log("inside if statemet");
    //   response.successResponse(res, 200, result);
    // } else if ((value = -1)) {
    //   result.sort((x, y) => {
    //     let a = x.field;
    //     let b = y.field;
    //     return b - a;
    //   });
    //   console.log("inside else if statemet");
    //   response.successResponse(res, 200, result);
    // } else {
    //   console.log("inside else if statemet");
    //   response.successResponse(res, 200, result);
    // }
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, "unable to fetch data");
  }
});

// get plant and ppe by user id
router.get("/getBy/:id", auth, async (req, res) => {
  try {
    log.debug("/plantAndPPE/getBy/userId/", req.params.id);
    if (req.designation == "ClientAdmin") {
      var validData = { clientAdminId: req.userId };
    } else {
      var validData = { userId: req.userId };
    }

    const empData = await commonController.getOne(User, {
      _id: req.params.id,
    });
    const ppeData = await commonController.getByPopulate(
      PPEReturn,
      {
        employeeId: empData.id,
      },
      ["managerName", "employeeId"]
    );
    const plantData = await commonController.getByPopulate(
      PlantReturn,
      {
        employeeId: empData.id,
      },
      ["managerName", "employeeId"]
    );
    const resultArr = [plantData, ppeData];
    const result = resultArr.flat();
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, "unable to fetch data");
  }
});

// get plant or PPE by id
router.get("/getPlantPpe/:id", auth, async (req, res) => {
  try {
    const ppeResult = await commonController.getByPopulate(
      PPEReturn,
      {
        _id: req.params.id,
      },
      ["managerName", "employeeId"]
    );
    const plantResult = await commonController.getByPopulate(
      PlantReturn,
      {
        _id: req.params.id,
      },
      ["managerName", "userId"]
    );
    const data = [ppeResult, plantResult];
    const result = data.flat();
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, "unable to fetch data");
  }
});

// update plant return
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/PlantReturn", req.params.id);
    const result = await commonController.updateBy(
      PlantReturn,
      req.params.id,
      req.body
    );
    response.successResponse(
      res,
      200,
      MESSAGE.PLAN_RETURN_UPDATED + req.params.id
    );
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_PLAN_RETURN + req.params.id
    );
  }
});

// delete plant return
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/PlantReturn", req.params.id);
    const result = await commonController.delete(PlantReturn, req.params.id);
    response.successResponse(res, 200, MESSAGE.PLAN_RETURN_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_PLAN_RETURN + req.params.id
    );
  }
});

module.exports = router;
