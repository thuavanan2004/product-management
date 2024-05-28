const express = require("express");
const routers = express.Router();


const controller = require("../../controller/client/cart.controller");

routers.get("/", controller.index);

routers.post("/add/:productId", controller.addPost);

routers.get("/delete/:productId", controller.delete);

routers.get("/update/:productId/:quantity", controller.updateItem);

module.exports = routers;