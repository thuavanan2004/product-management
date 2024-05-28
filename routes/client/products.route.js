const express = require("express");
const routers = express.Router();
const controllerProducts = require("../../controller/client/product.controller");

routers.get("/", controllerProducts.index);

routers.get("/detail/:slug", controllerProducts.detail)

routers.get("/:slugCategory", controllerProducts.category)

module.exports = routers;