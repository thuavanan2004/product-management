const express = require("express");
const routers = express.Router();
const controllerProducts = require("../../controller/client/product.controller");

routers.get("/", controllerProducts.index);

routers.get("/detail/:slug", controllerProducts.detail)

module.exports = routers;