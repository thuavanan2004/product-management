const express = require("express");
const routers = express.Router();

const dashboardController = require("../../controller/admin/dashboard.controller");

routers.get("/", dashboardController.index);

module.exports = routers;