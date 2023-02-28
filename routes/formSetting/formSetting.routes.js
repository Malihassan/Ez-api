const router = require("express").Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const JobTaskCategory = mongoose.model("JobTaskCategory");
const RiskAssessmentOption = mongoose.model("RiskAssessmentOption");
const commonController = require("../../controller/commonController");
const message = require("../../helper/message");
const response = require("../../helper/response");
const log = require("../../helper/logger");
const tableStatus = require("../../helper/enums/tableStatus");

/**
 * @swagger
 * /riskAssessmentFormSetting/getJobTaskCategories:
 *   get:
 *     tags:
 *       - JobTask
 *     description: get Job Task Categories with option
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.get("/getJobTaskCategories", async (req, res) => {
  try {
    log.debug("/riskAssessmentFormSetting/getJobTaskCategories");
    const result = await JobTaskCategory.aggregate([
      {
        $match: {
          company: {
            $eq: mongoose.Types.ObjectId(req.companyId),
          },
        },
      },
      {
        $lookup: {
          from: "riskassessmentoptions",
          localField: "checkboxes",
          foreignField: "_id",
          as: "checkboxes",
        },
      },
      {
        $unwind: {
          path: "$checkboxes",
          preserveNullAndEmptyArrays: true,
        },
      },
      // this for make relation with each id in relatedCheckboxes array
      // {
      //   $lookup: {
      //     from: "riskassessmentoptions",
      //     localField: "checkboxes.relatedCheckboxes",
      //     foreignField: "_id",
      //     as: "checkboxes.relatedCheckboxes",
      //   },
      // },
      {
        $group: {
          _id: {
            _id: "$_id",
            categoryName: "$categoryName",
            status: "$status",
          },
          categoryCheckboxes: {
            $push: "$checkboxes",
          },
        },
      },
      {
        $project: {
          _id: "$_id._id",
          categoryName: "$_id.categoryName",
          status: "$_id.status",
          checkboxes: "$categoryCheckboxes",
        },
      },
    ]);
    // need to delete relatedcheckbox from checkbox array if not have _id
    const newresult = result.filter((category, index) => {
      return category.checkboxes.filter((checkbox, index) => {
        if (!checkbox.hasOwnProperty("_id")) {
          category.checkboxes.splice(index, 1);
        }
      });
    });
    response.successResponse(res, 200, newresult);
  } catch (error) {
    console.log(error.message);
    response.errorMsgResponse(
      res,
      500,
      message.UNABLE_TO_FETCH_RISKASSESSMENT_OPTIONS
    );
  }
});
/**
 * @swagger
 * /riskAssessmentFormSetting/addJobTaskCategory:
 *   post:
 *     tags:
 *       - JobTask
 *     description: add Job Task Categories
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: jobTask
 *         description: jobTask body Request
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - categoryName
 *           properties:
 *             categoryName:
 *               type: string
 *     responses:
 *       200:
 *         description: Returns success message
 *       500:
 *        description: Unable to create job task
 */
// add JobTask category
router.post("/addJobTaskCategory", async (req, res) => {
  try {
    log.debug("/riskAssessmentFormSetting/addJobTaskCategory");
    const validData = _.pick(req.body, ["categoryName"]);
    validData.status = tableStatus.ACTIVE;
    validData.company = req.companyId;
    validData.checkboxes = [];
    const jobTaskCategoryadd = await commonController.addNewIfNotExist(
      JobTaskCategory,
      { categoryName: validData.categoryName },
      validData,
      { __v: 0 }
    );

    response.successResponse(res, 200, jobTaskCategoryadd);
  } catch (error) {
    response.errorMsgResponse(res, 500, message.UNABLE_TO_CREATE_JOB_TASK);
  }
});
/**
 * @swagger
 * /riskAssessmentFormSetting/updateJobTaskCategory/{id}:
 *   put:
 *     tags:
 *       - JobTask
 *     description: get Company details before Update
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: id
 *         description: id
 *         in: path
 *         required: true
 *       - name: jobTask
 *         description: jobTask body Request
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             categoryName:
 *               type: string
 *             status:
 *               type: string
 *               enum: [deactivate, active]
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.put("/updateJobTaskCategory/:id", async (req, res) => {
  try {
    log.debug(
      "/riskAssessmentFormSetting/updateJobTaskCategory/",
      req.params.id
    );
    const validData = _.pick(req.body, ["categoryName", "status"]);
    const updatedJobTaskCategory = await commonController.updateByID(
      JobTaskCategory,
      req.params.id,
      validData
    );
    response.successResponse(res, 200, updatedJobTaskCategory);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, message.UNABLE_TO_UPDATE_JOB_TASK);
  }
});

/**
 * @swagger
 * /riskAssessmentFormSetting/addJobTaskOptionInCategory/{id}:
 *   post:
 *     tags:
 *       - JobTask
 *     description: add option in category in JobTask
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: id
 *         description: category ID
 *         in: path
 *         required: true
 *       - name: jobTask
 *         description: jobTask body Request
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             identityHazard:
 *               type: string
 *             controlAndAction:
 *               type: string
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.post("/addJobTaskOptionInCategory/:id", async (req, res) => {
  log.debug(
    "/riskAssessmentFormSetting/addJobTaskOptionInCategory",
    req.params.id
  );
  try {
    const validData = _.pick(req.body, ["name"]);
    validData.status = tableStatus.ACTIVE;
    const newOption = await commonController.addNewIfNotExist(
      RiskAssessmentOption,
      { name: validData.name },
      validData,
      { __v: 0, relatedOptions: 0 }
    );
    await commonController.updateByID(JobTaskCategory, req.params.id, {
      $addToSet: { checkboxes: newOption._id },
    });
    response.successResponse(res, 200, newOption);
  } catch (error) {
    console.log(error.message);
    response.errorMsgResponse(res, 500, message.UNABLE_TO_CREATE_OPTION);
  }
});

/**
 * @swagger
 * /riskAssessmentFormSetting/deleteJobTaskOptionInCategory/{categoryId}/{optionId}:
 *   delete:
 *     tags:
 *       - JobTask
 *     description: delete option in category in JobTask
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: category ID
 *         in: path
 *         required: true
 *       - name: optionId
 *         description: option ID
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.delete(
  "/deleteJobTaskOptionInCategory/:categoryId/:optionId",
  async (req, res) => {
    log.debug(
      "/riskAssessmentFormSetting/deleteJobTaskOptionInCategory",
      req.params.categoryId,
      req.params.optionId
    );
    try {
      const { optionId, categoryId } = req.params;
      const newOption = await commonController.deleteByID(
        RiskAssessmentOption,
        optionId
      );
      await commonController.updateByID(JobTaskCategory, categoryId, {
        $pull: { checkboxes: newOption._id },
      });
      response.successResponse(res, 200, message.OPTION_DELETED);
    } catch (error) {
      console.log(error.message);
      response.errorMsgResponse(res, 500, message.UNABLE_TO_CREATE_OPTION);
    }
  }
);
/**
 * @swagger
 * /riskAssessmentFormSetting/addRelatedOption:
 *   put:
 *     tags:
 *       - Options
 *     description: add relation between checkboxes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: option
 *         description: option body Request
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - optionId
 *             - relatedOptionIds
 *           properties:
 *             optionId:
 *               type: string
 *             relatedOptionIds:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.put("/addRelatedOption", async (req, res) => {
  try {
    const { relatedOptionIds, optionId } = req.body;
    log.debug(
      "/riskAssessmentFormSetting/addRelatedOption/",
      relatedOptionIds,
      optionId
    );
    await commonController.updateByID(RiskAssessmentOption, optionId, {
      relatedCheckboxes: [...relatedOptionIds],
    });
    response.successResponse(res, 200, message.OPTION_UPDATED);
  } catch (error) {
    response.errorMsgResponse(res, 500, message.UNABLE_TO_UPDATE_OPTION);
  }
});
/**
 * @swagger
 * /riskAssessmentFormSetting/deleteJobTaskCategory/{id}:
 *   delete:
 *     tags:
 *       - JobTask
 *     description: delete category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: id
 *         description: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.delete("/deleteJobTaskCategory/:id", async (req, res) => {
  try {
    log.debug(
      "/riskAssessmentFormSetting/deleteJobTaskCategory/",
      req.params.id
    );
    await commonController.deleteByID(JobTaskCategory, req.params.id);
    response.successResponse(res, 200, message.JOB_TASK_DELETED);
  } catch (error) {
    response.errorMsgResponse(res, 500, message.UNABLE_TO_DELETE_JOB_TASK);
  }
});

//add JobTask option
//update JobTask option
//delete JobTask option
/**
 * @swagger
 * /riskAssessmentFormSetting/getOptionsByCategory/{category}:
 *   get:
 *     tags:
 *       - Options
 *     description: get options by category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: category
 *         description: category
 *         enum: [ALL,High Risk Construction,PPE Selection,Licence And Qualifications, Code Of Practice]
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.get("/getOptionsByCategory/:category", async (req, res) => {
  try {
    log.debug(
      "/riskAssessmentFormSetting/getOptionsByCategory",
      req.params.category
    );
    const query = {
      $and: [
        {
          company: {
            $eq: mongoose.Types.ObjectId("63ee1d472e24da960eaed36c"),
          },
        },
      ],
    };
    if (req.params.category === "ALL") {
      query.$and.push({
        categoryName: {
          $ne: null,
        },
      });
    } else {
      query.$and.push({
        categoryName: {
          $eq: req.params.category,
        },
      });
    }
    const checkBoxes = await RiskAssessmentOption.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$categoryName",
          checkBoxes: {
            $push: {
              _id: "$_id",
              status: "$status",
              name: "$name",
              identityHazard: "$identityHazard",
              controlAndAction: "$controlAndAction",
            },
          },
        },
      },
    ]);
    response.successResponse(res, 200, checkBoxes);
  } catch (error) {
    response.errorMsgResponse(res, 500, message.UNABLE_TO_FETCH_OPTION);
  }
});

/**
 * @swagger
 * /riskAssessmentFormSetting/addOption:
 *   post:
 *     tags:
 *       - Options
 *     description: add Option for category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: option
 *         description: option body Request
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - categoryName
 *           properties:
 *             name:
 *               type: string
 *             categoryName:
 *               type: string
 *               enum: [High Risk Construction,PPE Selection,Licence And Qualifications, Code Of Practice]
 *             identityHazard:
 *               type: string
 *             controlAndAction:
 *               type: string
 *     responses:
 *       200:
 *         description: Returns success message
 *       500:
 *        description: Unable to create option
 */
router.post("/addOption", async (req, res) => {
  try {
    log.debug("/riskAssessmentFormSetting/addOption/");

    const validData = _.pick(req.body, [
      "categoryName",
      "name",
      "identityHazard",
      "controlAndAction",
    ]);
    validData.status = tableStatus.ACTIVE;
    validData.company = req.companyId
    validData.identityHazard = "";
    validData.controlAndAction = "";
    const addOption = await commonController.addNewIfNotExist(
      RiskAssessmentOption,
      { name: validData.name },
      validData,
      { __v: 0, relatedOptions: 0 }
    );
    response.successResponse(res, 200, addOption);
  } catch (error) {
    response.errorMsgResponse(res, 500, message.UNABLE_TO_CREATE_OPTION);
  }
});
/**
 * @swagger
 * /riskAssessmentFormSetting/updateOption/{id}:
 *   put:
 *     tags:
 *       - Options
 *     description: update Option for category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: id
 *         description: option id
 *         in: path
 *         required: true
 *       - name: option
 *         description: option body Request
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             identityHazard:
 *               type: string
 *             controlAndAction:
 *               type: string
 *             status:
 *               type: string
 *               enum: [deactivate, active]
 *     responses:
 *       200:
 *         description: Returns success message
 *       500:
 *        description: Unable to update option
 */
router.put("/updateOption/:id", async (req, res) => {
  try {
    log.debug("/riskAssessmentFormSetting/updateOption/", req.params.id);
    const validData = _.pick(req.body, [
      "name",
      "identityHazard",
      "controlAndAction",
      "status",
    ]);
    const updateedOption = await commonController.updateByID(
      RiskAssessmentOption,
      req.params.id,
      validData,
      { __v: 0, relatedOptions: 0 }
    );
    response.successResponse(res, 200, updateedOption);
  } catch (error) {
    response.errorMsgResponse(res, 500, message.UNABLE_TO_UPDATE_OPTION);
  }
});
/**
 * @swagger
 * /riskAssessmentFormSetting/daleteOption/{id}:
 *   delete:
 *     tags:
 *       - Options
 *     description: delete option
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         description: authorization token (get from login) ***JWT amknfififl**
 *         in: header
 *         required: true
 *       - name: id
 *         description: option id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns success responsage
 *       500:
 *        description: Unable to delete option
 */
router.delete("/daleteOption/:id", async (req, res) => {
  try {
    log.debug("/riskAssessmentFormSetting/deleteOption/", req.params.id);
    await commonController.deleteByID(RiskAssessmentOption, req.params.id);
    response.successResponse(res, 200, message.OPTION_DELETED);
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 500, message.UNABLE_TO_DELETE_OPTION);
  }
});

module.exports = router;
