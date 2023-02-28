const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const mongoose = require("mongoose");
const CompanyDetail = mongoose.model("CompanyDetail");
const Branch = mongoose.model("Branch");
const User = mongoose.model("User");
const auth = require("../../helper/auth");

// add Branch details
router.post("/add", async (req, res) => {
    try {
        log.debug("/add/Branch");
        const result = await commonController.add(Branch, req.body);
        response.successResponse(
            res,
            200,
            MESSAGE.COMPANY_DETAIL_CREATED + result._id
        );
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            200,
            MESSAGE.UNABLE_TO_CREATE_COMPANY_DETAIL
        );
    }
});

// get all Branch Detail
router.get("/getAll", async (req, res) => {
    try {
        log.debug("/getAll/Branch");
        const result = await commonController.getAll(Branch);
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY_DETAIL);
    }
});

// get Branch Detail
router.get("/get", auth, async (req, res) => {
    try {
        log.debug("/get/Branch");
        const result = await commonController.getOne(Branch, {
            userId: req.userId,
        });
        console.log(req.userId);
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_COMPANY_DETAIL);
    }
});

// update Company Detail
// router.put("/update/:id", async (req, res) => {
//   try {
//     log.debug("/update/CompanyDetail", req.params.id);
//     const result = await commonController.updateBy(
//       CompanyDetail,
//       req.params.id,
//       req.body
//     );
//     response.successResponse(
//       res,
//       200,
//       MESSAGE.COMPANY_DETAIL_UPDATED + req.params.id
//     );
//   } catch (error) {
//     log.error(error);
//     response.errorMsgResponse(
//       res,
//       500,
//       MESSAGE.UNABLE_TO_UPDATE_COMPANY_DETAIL + req.params.id
//     );
//   }
// });

router.put("/update", auth, async (req, res) => {
    try {
        log.debug("/update/Branch");
        const result = await commonController.updateWithObject(
            Branch,
            // { userId: '62090788d083841874e3faab' },
            { userId: req.userId },
            req.body
        );
        response.successResponse(res, 200, MESSAGE.COMPANY_DETAIL_UPDATED);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_UPDATE_COMPANY_DETAIL
        );
    }
});

// delete Company Detail
router.delete("/delete/:id", async (req, res) => {
    try {
        log.debug("/delete/CompanyDetail", req.params.id);
        const result = await commonController.delete(Branch, req.params.id);
        response.successResponse(res, 200, MESSAGE.COMPANY_DETAIL_DELETED);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_DELETE_COMPANY_DETAIL + req.params.id
        );
    }
});

module.exports = router;
