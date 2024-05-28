const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controller/admin/setting.controller");

const upload = multer();


router.get("/general", controller.general);

router.patch("/general", upload.single("logo"), uploadCloud.uploadSingle, controller.generalPatch);

module.exports = router;