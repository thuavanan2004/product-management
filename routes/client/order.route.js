const express = require("express");
const routers = express.Router();
const controller = require("../../controller/client/order.controller");

routers.get("/info", controller.info);

routers.post("/checkout", controller.order);

routers.get("/payment/:orderId", controller.payment);

routers.post("/payment/:orderId", controller.paymentPost);

routers.get("/success/:orderId", controller.success);

module.exports = routers;