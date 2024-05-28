const express = require("express");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();

const controller = require("../../controller/admin/blog.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single("thumbnail"), uploadCloud.uploadSingle, controller.createPost);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.delete);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.uploadSingle, controller.editPatch);

router.get("/trash", controller.trash);

router.patch("/recall/:id", controller.recall);

router.delete("/remove/:id", controller.remove);


module.exports = router;