const express = require("express");
const multer = require("multer");
const routers = express.Router();
const validate = require("../../views/admin/validates/products.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

const controller = require("../../controller/admin/product-category.controller");

routers.get("/", controller.index);

routers.get("/create", controller.create);

routers.post("/create", upload.single('thumbnail'), uploadCloud.uploadSingle, validate.createPost, controller.createPost);

routers.get("/edit/:id", upload.single('thumbnail'), controller.edit);

routers.patch("/edit/:id", upload.single('thumbnail'), uploadCloud.uploadSingle, validate.createPost, controller.editPatch);

routers.delete("/delete/:id", controller.delete);

routers.get("/detail/:id", controller.detail)

routers.patch("/change-status/:status/:id", controller.changeStatus)

routers.patch("/change-multi", controller.changeMulti)

routers.get("/trash", controller.trash)

routers.patch("/recall/:id", controller.recall)

routers.delete("/remove/:id", controller.remove)

routers.patch("/change-multi", controller.changeMultiTrash)

routers.delete("/change-multi", controller.removeAll)

module.exports = routers;