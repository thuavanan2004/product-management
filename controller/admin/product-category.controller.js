const { prefixAdmin } = require("../../config/system");
const createTree = require("../../helpers/createTree.helper");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");


// [GET] /admin/products-category/
module.exports.index = async (req, res) => {
    let find ={
        deleted: false
    }
    const filterStatus = filterHelper(req);
    if(req.query.status){
        find.status = req.query.status
    }
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    
    const totalDocument = await ProductCategory.countDocuments(find);
    const objectPagination = paginationHelper(req, totalDocument);

    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }else {
        sort["position"] = "desc"
    }

    const records = await ProductCategory
    .find(find)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skipPage)
    .sort(sort); 

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
    
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    });
}

// [GET] /admin/products-category/create
module.exports.create =  async (req, res) => {
    const records = await ProductCategory.find({ 
        deleted: false
    }); 
    const newRecord = createTree(records);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Thêm mới danh mục",
        records: newRecord
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_create")){
        res.send("Không có quyền truy cập");
        return;
    }
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }else{
        const count = await ProductCategory.countDocuments({});
        req.body.position = count + 1;
    }
    req.body.createdBy = res.locals.user.id;
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${prefixAdmin}/products-category`);
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
   try{
    const id = req.params.id;
    const records = await ProductCategory.find({
        deleted: false
    }); 
    const data = await ProductCategory.findOne({
        _id: id,
        deleted: false
    })
    const newRecord = createTree(records);
    
    res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa danh mục",
        records: newRecord,
        data: data
    });
   }catch{
    res.redirect(`${prefixAdmin}/products-category`);
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    req.body.position = parseInt(req.body.position);
    req.body.updatedBy = res.locals.user.id;
    const id = req.params.id;
    try {
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash("success", `Cập nhật danh mục thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật danh mục không thành công!`);
    }
    res.redirect(`${prefixAdmin}/products-category`);
}
 
// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_delete")){
        res.send("Không có quyền truy cập");
        return;
    }
    const id = req.params.id;
    await ProductCategory.updateOne({
        _id: id
    }, {
        deleted: true,
        deleteAt: new Date(),
        deletedBy: res.locals.user.id
    });
    res.redirect("back");
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    
    req.body.position = parseInt(req.body.position);
    const id = req.params.id;
    const [data] = await ProductCategory.find({
        _id: id
    })
    res.render("admin/pages/products-category/detail", {
        pageTitle: "Trang chi tiết danh mục",
        data: data
    });
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    const id = req.params.id;
    const status = req.params.status;
    try{
        const response = await ProductCategory.updateOne({
            _id: id,
            deleted: false
        }, {
            status: status,
            updatedBy: res.locals.user.id,
            updatedAt: new Date()
        })
        if(response) {
            req.flash("succes", "Cập nhật trạng thái danh mục sản phẩm thành công")
        }
    } catch {
        req.flash("error", "Cập nhật trạng thái danh mục sản phẩm thất bại")
    }
        res.redirect('back');
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeMulti = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const type = req.body.type;
        let ids = req.body.ids;
        ids = ids.split(", ");
        switch (type) {
            case "active":
            case "inactive": 
                await ProductCategory.updateMany({
                    _id: {$in: ids}
                }, {
                    status: type,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                });
                break;
            case "delete-all":
                await ProductCategory.updateMany({
                    _id: {$in: ids}
                }, {
                    deleted: true,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                })
                break;
            case "change-position":
                for(item of ids){
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await ProductCategory.updateOne({
                        _id: id
                    }, {
                        position: position,
                        updatedBy: res.locals.user.id,
                        updatedAt: new Date()
                    })
                }
                break;
            default: 
                break;
        }

        req.flash("success", "Cập nhật trạng thái thành công !");
        res.redirect(`back`);
    }catch {
        req.flash("error", "Cập nhật trạng thái không thành công !");
        res.redirect(`back`);
    }
}

// [GET] /admin/products-category/trash
module.exports.trash = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    let find ={
        deleted: true
    }
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    
    const totalDocument = await ProductCategory.countDocuments(find);
    const objectPagination = paginationHelper(req, totalDocument);

    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }else {
        sort["position"] = "desc"
    }

    const records = await ProductCategory
    .find(find)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skipPage)
    .sort(sort); 

    for (const record of records) {
        const deletedBy = await Account.findOne({
            _id: record.updatedBy
        })
        record.deletedBy = deletedBy?.fullName
    }
    
    res.render("admin/pages/products-category/trash", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    });
}

// [PATCH] /admin/products-category/recall/:id
module.exports.recall = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    
    try{
        const id = req.params.id;
        await ProductCategory.updateOne({
            _id: id
        }, {
            deleted: false,
            updatedAt: new Date(),
            updatedBy: res.locals.user.id
        })
        req.flash("success", "Khôi phục danh mục thành công");
        res.redirect(`${prefixAdmin}/products-category`)
    }catch{
        req.flash("error", "Khôi phục danh mục thất bại");
        res.redirect(`back`)
    }
   
}

// [DELETE] /admin/products-category/remove/:id
module.exports.remove = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_delete")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const id = req.params.id;
        await ProductCategory.deleteOne({
            _id: id
        })
        req.flash("success", "Xóa danh mục thành công !")
        res.redirect("back")
    }catch {
        req.flash("error", "Xóa danh mục thất bại !")
        res.redirect("back")
    }
    
}

// [PATCH] /admin/products-category/change-multi/
module.exports.changeMultiTrash = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products-category_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        const type = req.body.type;
        let ids = req.body.ids;
        ids = ids.split(", ");
        switch (type) {
            case "recall-all":
                await ProductCategory.updateMany({
                    _id: {$in: ids}
                }, {
                    deleted: false,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                })
                break;
            default: 
                break;
        }   
        req.flash("success", "Khôi mục danh mục thành công !");
        res.redirect(`back`);
    }catch {
        req.flash("error", "Khôi phục danh mục không thành công !");
        res.redirect(`back`);
    }
}

// [DELETE] /admin/products-category/change-multi/
module.exports.removeAll = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if(!permissions.includes("products_edit")){
        res.send("Không có quyền truy cập");
        return;
    }
    try{
        
        const type = req.body.type;
        let ids = req.body.ids;
        ids = ids.split(", ");
        switch (type) {
            case "remove-all":
                await ProductCategory.deleteMany({
                    _id: {$in: ids}
                })
                break;
            default: 
                break;
        }   
        req.flash("success", "Xóa danh mục thành công !");
        res.redirect(`back`);
    }catch {
        req.flash("error", "Xóa danh mục không thành công !");
        res.redirect(`back`);
    }
}