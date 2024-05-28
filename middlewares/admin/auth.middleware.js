const express = require("express");
const app = express();
const {
    prefixAdmin
} = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");



module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }
    const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false,
        status: "active"
    });
    if (!user) {
        res.clearCookie("token");
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }

    const role = await Role.findOne({
        _id: user.role_id
    })
    res.locals.role = role;
    res.locals.user = user;

    next();
}