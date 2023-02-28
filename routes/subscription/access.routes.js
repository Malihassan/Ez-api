const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const Access = mongoose.model("Access");

//  update multiple Access
router.put("/update/multiple", auth, async (req, res) => {
  try {
    log.debug("/update/multiple/access");
    let ids = req.body.arrObj.map(({ roleId }) => roleId);
    let deleteResult = await Access.deleteMany({ roleId: { $in: ids } });
    console.log(deleteResult);
    if (deleteResult) {
      let obj = [];
      req.body.arrObj.forEach((element) => {
        var accessArr = [];
        element.accessArr.forEach((e) => {
          accessArr.push({
            formName: e.formName == undefined ? (e.formName = "") : e.formName,
            NavigationAccess:
              e.NavigationAccess == undefined
                ? (e.NavigationAccess = false)
                : e.NavigationAccess,
            Add: e.Add == undefined ? (e.Add = false) : e.Add,
            View: e.View == undefined ? (e.View = false) : e.View,
            Edit: e.Edit == undefined ? (e.Edit = false) : e.Edit,
            Delete: e.Delete == undefined ? (e.Delete = false) : e.Delete,
          });
        });

        obj.push({
          clientAdminId: req.userId,
          roleId: element.roleId,
          accessArr,
        });
      });
      const responseObj = await Access.insertMany(obj);
      if (responseObj) {
        response.successResponse(res, 200, MESSAGE.ACCESS_UPDATED);
      } else {
        response.errorMsgResponse(res, 500, "someting went wrong");
      }
    } else {
      response.errorMsgResponse(res, 500, "someting went wrong");
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_UPDATE_ACCESS);
  }
});

// get all Access
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/Access");
    const result = await commonController.getAllAuthRecordByPopulate(
      Access,
      { clientAdminId: req.userId },
      "roleId"
    );
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ACCESS);
  }
});

module.exports = router;
