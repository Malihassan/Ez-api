const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const Role = mongoose.model("Role");
const Access = mongoose.model("Access");
const User = mongoose.model("User");

//add Role
router.post("/add", auth, async (req, res) => {
  try {
    log.debug("/add/Role");
    const result = await commonController.add(Role, req.body);

    // const clientId = req.userId;

    // console.log(clientId);

    const data = {
      clientAdminId: req.userId,
      roleId: result._id,
      accessArr: [
        {
          formName: "dashboard",
          NavigationAccess: false,
          View: false,
          Delete: false,
          Edit: false,
          Add: false,
        },
        // {
        //   formName: "GenerateaNewForm",
        //   NavigationAccess: false,
        //   View: false,
        //   Delete: false,
        //   Edit: false,
        //   Add: false,
        // },
        // {
        //   formName: "LogicalForms",
        //   NavigationAccess: false,
        //   View: false,
        //   Delete: false,
        //   Edit: false,
        //   Add: false,
        // },
        // {
        //   formName: "FormList",
        //   NavigationAccess: false,
        //   View: false,
        //   Delete: false,
        //   Edit: false,
        //   Add: false,
        // },
        // {
        //   formName: "SubmittedForms",
        //   NavigationAccess: false,
        //   View: false,
        //   Delete: false,
        //   Edit: false,
        //   Add: false,
        // },
        {
          formName: "WHSForms",
          NavigationAccess: false,
          View: false,
          Delete: false,
          Edit: false,
          Add: false,
        },
        {
          formName: "CompanyInformation",
          NavigationAccess: false,
          View: false,
          Delete: false,
          Edit: false,
          Add: false,
        },
        // {
        //   formName: "FormSettings",
        //   NavigationAccess: false,
        //   View: false,
        //   Delete: false,
        //   Edit: false,
        //   Add: false,
        // },
      ],
    };

    const resultData = await commonController.add(Access, data);

    response.successResponse(res, 200, MESSAGE.ROLE_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_ROLE);
  }
});

// get all Role
router.get("/getAll", auth, async (req, res) => {
  try {
    log.debug("/getAll/Role");
    if (req.designation !== "User") {
      const result = await Role.find({
        clientAdminId: req.userId,
        status: { $ne: "deleted" },
      })
        .collation({ locale: "en" })
        .sort({
          role: 1,
        });
      response.successResponse(res, 200, result);
    } else {
      const userData = await commonController.getBy(User, { _id: req.userId });
      if (userData) {
        const roleData = await commonController.getBy(Role, {
          clientAdminId: userData[0].clientAdminId,
        });
        response.successResponse(res, 200, roleData);
      } else {
        log.debug(error);
        response.errorMsgResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
      }
    }
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ROLE);
  }
});

// get Role
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/get/Role", req.params.id);
    const result = await commonController.getOne(Role, {
      _id: req.params.id,
    });
    response.successResponse(res, 200, result);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ROLE);
  }
});

// update Role
router.put("/update/:id", auth, async (req, res) => {
  try {
    log.debug("/update/Role", req.params.id);
    const result = await commonController.updateBy(
      Role,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.ROLE_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_UPDATE_ROLE + req.params.id
    );
  }
});

// delete Role
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/Role", req.params.id);
    const roleResult = await commonController.delete(Role, req.params.id);

    if (roleResult) {
      const accessResult = await commonController.deleteByObject(Access, {
        roleId: req.params.id,
      });

      const userResult = await commonController.deleteByObject(User, {
        roleId: req.params.id,
      });
    }

    response.successResponse(res, 200, MESSAGE.ROLE_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_ROLE + req.params.id
    );
  }
});

module.exports = router;
