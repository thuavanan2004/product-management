const express = require("express");
const routers = express.Router();

const controller = require("../../controller/client/search.controller");

routers.use("/", controller.index)

module.exports = routers;