const router = require("express").Router();
const _ = require("lodash");
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const Company = mongoose.model("Company");
// add company
router.post("/add", async (req, res) => {
  try {
    log.debug("/add/company");
    const result = await commonController.add(Company, req.body);
    response.successResponse(res, 200, MESSAGE.COMPANY_CREATED + result._id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_CREATE_COMPANY);
  }
});

// //get all company
// router.get("/getAll", async (req, res) => {
//    try {
//       log.debug("/get/company")
//       const result = await commonController.getAll(Company)
//       if (result.length) {
//          response.successResponse(res, 200, result);
//       } else {
//          response.successResponse(res, 200, MESSAGE.NO_COMPANY_FOUND);
//       }
//    } catch (error) {
//       log.error(error)
//       response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY)
//    }
// });

/**
 * @swagger
 * /company/get/{id}:
 *   get:
 *     tags:
 *       - Company
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
 *     responses:
 *       200:
 *         description: Returns success responsage
 */
router.get("/get/:id", async (req, res) => {
  try {
    log.debug("/company/get", req.params.id);
    const result = await commonController.getOne(Company, {
      _id: req.params.id,
    });
    const companyValidData = _.omit(result.toObject(), [
      "createdAt",
      "status",
      "plan",
    ]);
    response.successResponse(res, 200, companyValidData);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY);
  }
});
// /**
//  * @swagger
//  * /company/update/{id}:
//  *   get:
//  *     tags:
//  *       - Company
//  *     description: update Company details
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: authorization
//  *         description: authorization token (get from login) ***JWT amknfififl**
//  *         in: header
//  *         required: true
//  *         schema:
//  *           type: object
//  *           required:
//  *             - companyName
//  *             - accountType
//  *             - teamSize
//  *             - companyIndustry
//  *             - companyDepartment
//  *             - companyPhone
//  *             - companyEmail
//  *             - companyDescription
//  *           properties:
//  *             companyName:
//  *               type: string
//  *             accountType:
//  *               type: string
//  *             teamSize:
//  *               type: string
//  *             companyIndustry:
//  *               type: string
//  *             companyDepartment:
//  *               type: string
//  *             companyPhone:
//  *               type: string
//  *             companyEmail:
//  *               type: string
//  *             companyDescription:
//  *               type: string
//  *             companyAddress:
//  *               type: object
//  *             socialMediaProfiles:
//  *               type: array
//  *             website:
//  *               type: string
//  *             businessLicenses:
//  *               type: string
//  *     responses:
//  *       200:
//  *         description: Returns success responsage
//  */
// update company
router.put("/update/:id", async (req, res) => {
  try {
    log.debug("/company/update", req.params.id);
    const result = await commonController.updateBy(
      Company,
      req.params.id,
      req.body
    );
    response.successResponse(res, 200, MESSAGE.COMPANY_UPDATED + req.params.id);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_UPDATE_COMPANY);
  }
});

// delete company
router.delete("/delete/:id", async (req, res) => {
  try {
    log.debug("/delete/company", req.params.id);
    const result = await commonController.delete(Company, req.params.id);
    response.successResponse(res, 200, MESSAGE.COMPANY_DELETED);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(
      res,
      500,
      MESSAGE.UNABLE_TO_DELETE_COMPANY + req.params.id
    );
  }
});

module.exports = router;
