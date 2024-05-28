const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../views/admin/validates/account.validate");

const router = express.Router();
const upload = multer();

const controller = require("../../controller/admin/account.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single('avatar'), uploadCloud.uploadSingle, validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single('avatar'), uploadCloud.uploadSingle, validate.editPatch, controller.editPatch);

router.get("/edit/:id", controller.edit);

router.delete("/delete/:id", controller.delete);


module.exports = router;