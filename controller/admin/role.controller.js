const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

// [GET] /admin/roles/
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    })

    for (const record of records) {
        const createdBy = await Account.findOne({
            _id: record.createdBy
        })
        const updatedBy = await Account.findOne({
            _id: record.updatedBy
        })
        record.createdBy = createdBy?.fullName
        record.updatedBy = updatedBy?.fullName

    }
    res.render("admin/pages/roles/index", {
        pageTitle: "Trang nhóm phân quyền",
        records: records
    });
};

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Trang thêm mới nhóm quyền"
    });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("roles_create")){
        res.send("Không có quyền truy cập");
        return;
    }
    req.body.createdBy = res.locals.user.id
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit
module.exports.edit = async (req, res) => {
   try{
        const id = req.params.id;
        const data = await Role.findOne({
            _id: id,
            deleted: false
        });
        res.render("admin/pages/roles/edit", {
            pageTitle: "Trang chỉnh sửa sản phẩm",
            data: data
        });
   }catch{
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
   }
};

// [PATCH] /admin/roles/edit
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("roles_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const id = req.params.id;
        req.body.updatedBy = res.locals.user.id;
        await Role.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật nhóm quyền thành công!")
    }catch{
        req.flash("error", "Cập nhật nhóm quyền không thành công!")
    }
   
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/detail
module.exports.detail = async (req, res) => {
    res.render(`admin/pages/roles/detail`);
};

// [DELETE] /admin/roles/delete
module.exports.delete = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("roles_delete")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const id = req.params.id;
        const response = await Role.updateOne({
            _id: id
        },{
            deleted: true,
            deletedAt: new Date(),
            deletedBy: res.locals.user.id

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

// [GET] /admin/roles/permissions/
module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/permissions", {
        pageTitle:"Trang phân quyền",
        records: records
    });
}

// [PATCH] /admin/roles/permissions/
module.exports.permissionsPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("roles_permissions")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const roles = JSON.parse(req.body.roles);
        for (const item of roles) {
            await Role.updateOne({
                _id: item.id
            }, {
                permissions: item.permissions
            });
        }

        req.flash("success", "Thêm mới chức năng phân quyền thành công !")
    } catch {
        req.flash("error", "Thêm mới chức năng phân quyền không thành công !")
    }
    res.redirect("back");
}
