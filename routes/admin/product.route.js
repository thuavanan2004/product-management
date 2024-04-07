const express = require("express");
const multer = require("multer");
const routers = express.Router();
const storage = require("../../helpers/storageMulter.helper");
const validate = require("../../views/admin/validates/products.validate");

const upload = multer({ storage: storage })

const productController = require("../../controller/admin/product.controller");

routers.get("/", productController.index);

routers.patch("/change-status/:status/:id", productController.changeStatus);

routers.patch("/change-multi", productController.changeMulti);

routers.delete("/delete/:id", productController.deleteItem);

routers.get("/trash", productController.trash);

routers.patch("/recall/:id", productController.recallItem);

routers.delete("/remove/:id", productController.removeItem);

routers.get("/create", productController.create);

routers.post("/create", upload.single('thumbnail'), validate.createPost, productController.createPost);

routers.get("/edit/:id", productController.edit);

routers.patch("/edit/:id",upload.single('thumbnail'), validate.createPost, productController.editPatch);

routers.get("/detail/:id",productController.detail )

module.exports = routers;