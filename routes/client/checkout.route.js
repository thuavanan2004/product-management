const express = require("express");
const routers = express.Router();
const controller = require("../../controller/client/checkout.controller");

routers.get("/", controller.index);

routers.post("/order", controller.order);

routers.get("/success/:orderId", controller.success);

module.exports = routers;