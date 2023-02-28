const router = require("express").Router();
const commonController = require("../../controller/commonController");
const response = require("../../helper/response");
const MESSAGE = require("../../helper/message");
const log = require("../../helper/logger");
const auth = require("../../helper/auth");
const mongoose = require("mongoose");
const Item = mongoose.model("Item");
const ItemCategory = mongoose.model("ItemCategory");

// add Item Category
router.post("/addCategory", async (req, res) => {
    try {
        log.debug("/addCategory/ItemCategory");
        const result = await commonController.add(ItemCategory, req.body);
        response.successResponse(
            res,
            200,
            MESSAGE.ITEM_CATEGORY_CREATED + result._id
        );
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_CREATE_ITEM_CATEGORY
        );
    }
});

//get all Categories
router.get("/getAllCategories", async (req, res) => {
    try {
        log.debug("/getAllCategories/ItemCategory");
        const userData = req.userId;
        const result = await ItemCategory.find({ status: { $ne: "deleted" } });
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ITEM_CATEGORYIES);
    }
});


//get categories by type [plant,PPE,equipment]
router.get("/getAllCategories/:type", async (req, res) => {
    try {
        // log.debug("/getAllCatItems/Items");
        // console.log(req.params)
        const result = await ItemCategory.find(
            {
                ...req.params, status: { $ne: "deleted" }
            }
        );
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ITEM);
    }
});
// // get Sub Contractor
// router.get("/get/:id", async (req, res) => {
//     try {
//         log.debug("/get/SubContractor", req.params.id);
//         const result = await commonController.getOne(SubContractor, {
//             _id: req.params.id,
//         });
//         response.successResponse(res, 200, result);
//     } catch (error) {
//         log.error(error);
//         response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_SUB_CONTRACTOR);
//     }
// });

// update Item Category
router.put("/updateCategory/:id", async (req, res) => {
    try {
        log.debug("/updateCategory/ItemCategory", req.params.id);
        const result = await commonController.updateBy(
            ItemCategory,
            req.params.id,
            req.body
        );
        response.successResponse(
            res,
            200,
            MESSAGE.ITEM_CATEGORY_UPDATED + req.params.id
        );
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_UPDATE_ITEM_CATEGORY + req.params.id
        );
    }
});

// delete Item Category
router.delete("/deleteCategory/:id", async (req, res) => {
    try {
        log.debug("/deleteCategory/ItemCategory", req.params.id);
        const result = await commonController.delete(ItemCategory, req.params.id);
        response.successResponse(res, 200, MESSAGE.ITEM_CATEGORY_DELETED);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_DELETE_ITEM_CATEGORY + req.params.id
        );
    }
});


// add Item Category
router.post("/addItem", async (req, res) => {
    try {
        log.debug("/addItem/Item");
        const result = await commonController.add(Item, req.body);
        response.successResponse(
            res,
            200,
            MESSAGE.ITEM_CREATED + result._id
        );
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_CREATE_ITEM
        );
    }
});

//get all Items
router.get("/getAllItems", async (req, res) => {
    try {
        log.debug("/getAllItems/Items");
        const result = await Item.find({ status: { $ne: "deleted" } }).populate('parentId');
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ITEM);
    }
});

//get all Category Items
router.get("/getAllCatItems/:parentId", async (req, res) => {
    try {
        // log.debug("/getAllCatItems/Items");
        // console.log(req.params)
        const result = await commonController.getByPopulate(
            Item,
            { parentId: req.params.parentId },
            ['parentId']
        );
        response.successResponse(res, 200, result);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(res, 500, MESSAGE.UNABLE_TO_FETCH_ITEM);
    }
});

// delete item from certain category
router.delete("/deleteCatItem/:id", async (req, res) => {
    try {
        log.debug("/deleteCatItem/Item", req.params.id);
        const result = await commonController.delete(Item, req.params.id);
        response.successResponse(res, 200, MESSAGE.ITEM_DELETED);
    } catch (error) {
        log.error(error);
        response.errorMsgResponse(
            res,
            500,
            MESSAGE.UNABLE_TO_DELETE_ITEM + req.params.id
        );
    }
});

module.exports = router;
