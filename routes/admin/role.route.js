const express = require("express");
const routers = express.Router();
const rolesController = require("../../controller/admin/role.controller");

routers.get("/", rolesController.index);

routers.get("/create", rolesController.create);

routers.post("/create", rolesController.createPost);

routers.get("/edit/:id", rolesController.edit);

routers.patch("/edit/:id", rolesController.editPatch);

routers.get("/detail/:id", rolesController.detail);

routers.delete("/delete/:id", rolesController.delete);

routers.get("/permissions", rolesController.permissions);

routers.patch("/permissions", rolesController.permissionsPatch);

module.exports = routers;