const express = require("express");
const router = express.Router();
const controllers = require("../../controller/client/home.controller");

router.get("/",controllers.index);

module.exports = router;