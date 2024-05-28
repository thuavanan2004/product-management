const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const { prefixAdmin } = require("../../config/system");
const generateToken = require("../../helpers/generateToke.helper");

const md5 = require('md5');

// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false
    })
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        const createdBy = await Account.findOne({
            _id: record.createdBy,
            deleted: false
        });
        const updatedBy = await Account.findOne({
            _id: record.updatedBy,
            deleted: false
        });
        record.roleTitle = role.title;
        record.createdBy = createdBy?.fullName;
        record.updatedBy = updatedBy?.fullName;
    }
    res.render("admin/pages/account/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/account/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    })

}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("accounts_create")){
        res.send("Không có quyền truy cập");
        return;
    }
    req.body.createdBy = res.locals.user.id
    const account = req.body;
    account.password = md5("password");
    account.token = generateToken(30);
    const record = new Account(account);
    await record.save();
    res.redirect("back");
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const records = await Account.findOne({
        _id: id,
        deleted: false
    })
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/account/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        records: records,
        roles: roles
    });
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("accounts_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const id = req.params.id;
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else {
            delete req.body.password;
        }
        req.body.updatedBy = res.locals.user.id
        await Account.updateOne({
            _id: id,
            deleted: false,
            
        }, req.body);
        req.flash("success", `Cập nhật thông tin tài khoản thành công!`);
    } catch{
        req.flash("error", `Cập nhật thông tin tài khoản không thành công!`);
    }
    res.redirect(`${prefixAdmin}/accounts`);
}

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("accounts_delete")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const id = req.params.id;
        const response = await Account.updateOne({
            _id: id
        },{
            deleted: true,
            deletedBy: res.locals.user.id,
            deletedAt: new Date()
        })
        if(response){
            req.flash("succes", "Xóa sản nhóm quyền thành công !");
        }else{
            req.flash("error", "Xóa sản nhóm quyền không thành công !");
        }
    }catch{
        req.flash("error", "Xóa sản nhóm quyền không thành công !");
    }
    res.redirect("back");
}


