const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const prefixAdmin = require("../../config/system");
const createTree = require("../../helpers/createTree.helper");
const numeral = require('numeral');

// [GET] /admin/products/index
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // filter
    const filterStatus = filterHelper(req);
    if (req.query.status) {
        find.status = req.query.status;
    }
    // end filter
    // Search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // End Search
    // Pagination
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);
    // End Pagination
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }



    const products = await Product
        .find(find)
        .limit(objectPagination.limitPage)
        .skip(objectPagination.skipPage)
        .sort(sort);

    for (const product of products) {
        const createdBy = await Account.findOne({
            _id: product.createdBy
        })
        const updatedBy = await Account.findOne({
            _id: product.updatedBy
        })
        const deletedBy = await Account.findOne({
            _id: product.deletedBy
        })
        product.priceFormat = numeral(product.price).format('0,0');

        product.createdBy = createdBy ?.fullName;
        product.updatedBy = updatedBy ?.fullName;
        product.deletedBy = deletedBy ?.fullName;
    }

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    });
}

// [PATCH] /admin/products/changeStatus
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const status = req.params.status;
        const id = req.params.id;
        await Product.updateOne({
            _id: id
        }, {
            status: status,
            updatedBy: res.locals.user.id,
            updatedAt: new Date()
        })

        req.flash("success", "Cập nhật trạng thái thành công !");

        res.redirect(`back`);
    } catch {
        req.flash("error", "Cập nhật trạng thái không thành công !");

        res.redirect(`back`);
    }
}

// [PATCH] /admin/products/changeMultiStatus
module.exports.changeMulti = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const type = req.body.type;
        let ids = req.body.ids;
        ids = ids.split(", ");
        switch (type) {
            case "active":
            case "inactive":
                await Product.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: type,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                });
                break;
            case "delete-all":
                await Product.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                })
                break;
            case "change-position":
                for (item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Product.updateMany({
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
    } catch {
        req.flash("error", "Cập nhật trạng thái không thành công !");
        res.redirect(`back`);
    }
}

// [DELETE] /admin/products/changeMultI
module.exports.changeMultiTrash = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const type = req.body.type;
        let ids = req.body.ids;
        ids = ids.split(", ");
        switch (type) {
            case "remove-all":
                await Product.deleteMany({
                    _id: {
                        $in: ids
                    }
                })
                break;
            default:
                break;
        }
        req.flash("success", "Xóa sản phẩm thành công !");
        res.redirect(`back`);
    } catch {
        req.flash("error", "Xóa sản phẩm không thành công !");
        res.redirect(`back`);
    }
}

// [PATCH] /admin/products/deleteItem
module.exports.deleteItem = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_delete")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const id = req.params.id;
        await Product.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date(),
            deletedBy: res.locals.user.id
        });
        req.flash("success", "Xóa sản phẩm thành công !");
        res.redirect(`back`);
    } catch {
        req.flash("error", "Xóa sản phẩm không thành công !");
        res.redirect(`back`);
    }
}

// [GET] /admin/products/trash
module.exports.trash = async (req, res) => {
    const find = {
        deleted: true
    }
    const filterStatus = filterHelper(req);
    if (req.query.status) {
        find.status = req.query.status;
    }
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);

    const products = await Product
        .find(find)
        .limit(objectPagination.limitPage)
        .skip(objectPagination.skipPage);;

    for (const product of products) {
        const deletedBy = await Account.findOne({
            _id: product.deletedBy
        })
        product.deletedBy = deletedBy ?.fullName;
    }

    res.render("admin/pages/products/trash", {
        products: products,
        filterStatus: filterStatus,
        objectPagination: objectPagination
    });
}

// [PATCH] /admin/products/recall
module.exports.recallItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        deleted: false
    });
    req.flash("success", "Thu hồi sản phẩm thành công !");
    res.redirect(`back`);
}

// [DELETE] /admin/products/delete
module.exports.removeItem = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_delete")) {
        res.send("Không có quyền truy cập");
        return;
    }
    const id = req.params.id;
    await Product.deleteOne({
        _id: id
    })
    req.flash("success", "Xóa sản phẩm thành công !");
    res.redirect(`back`);

}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const category = await ProductCategory.find({
        deleted: false
    });
    const newRecord = createTree(category);
    res.render("admin/pages/products/create", {
        pageTitle: "Trang thêm mới sản phẩm",
        category: newRecord
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_create")) {
        res.send("Không có quyền truy cập");
        return;
    }

    req.body.discountPercentage = 0;
    if (req.body) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.createdBy = res.locals.user.id;
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countProduct = await Product.countDocuments({});
        req.body.position = countProduct + 1;
    }

    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    const record = new Product(req.body);
    await record.save();
    res.redirect(`${prefixAdmin.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const category = await ProductCategory.find({
        deleted: false
    });
    const newCategory = createTree(category);
    const product = await Product.findOne({
        _id: id
    });

    res.render("admin/pages/products/edit", {
        pageTitle: "Trang chỉnh sửa sản phẩm",
        product: product,
        category: newCategory
    });
}

// [PATCH] /admin/products/editPatch
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const id = req.params.id;

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        req.body.updatedBy = res.locals.user.id;

        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        await Product.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        req.flash("success", "Cập nhật sản phẩm thành công!");
        res.redirect(`${prefixAdmin.prefixAdmin}/products`);
    } catch {
        req.flash("error", "Cập nhật sản phẩm không thành công!");
        res.redirect(`back`);
    }

}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    })
    res.render("admin/pages/products/detail", {
        pageTitle: "Trang chi tiết sản phẩm",
        product: product
    });
}

// [GET] /admin/products/featured
module.exports.featured = async (req, res) => {
    const find = {
        deleted: false,
        featured: "1"
    }
    // filter
    const filterStatus = filterHelper(req);
    if (req.query.status) {
        find.status = req.query.status;
    }
    // end filter
    // Search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // End Search
    // Pagination
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);
    // End Pagination
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }



    const products = await Product
        .find(find)
        .limit(objectPagination.limitPage)
        .skip(objectPagination.skipPage)
        .sort(sort);

    for (const product of products) {
        const createdBy = await Account.findOne({
            _id: product.createdBy
        })
        const updatedBy = await Account.findOne({
            _id: product.updatedBy
        })
        const deletedBy = await Account.findOne({
            _id: product.deletedBy
        })
        product.createdBy = createdBy ?.fullName;
        product.updatedBy = updatedBy ?.fullName;
        product.deletedBy = deletedBy ?.fullName;
    }

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sản phẩm nổi bật",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    });
}


// [GET] /admin/products/new
module.exports.new = async (req, res) => {
    const find = {
        deleted: false,
    }
    // filter
    const filterStatus = filterHelper(req);
    if (req.query.status) {
        find.status = req.query.status;
    }
    // end filter
    // Search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // End Search
    // Pagination
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);
    // End Pagination
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }



    const products = await Product
        .find(find)
        .limit(objectPagination.limitPage)
        .skip(objectPagination.skipPage)
        .sort(sort);

    for (const product of products) {
        const createdBy = await Account.findOne({
            _id: product.createdBy
        })
        const updatedBy = await Account.findOne({
            _id: product.updatedBy
        })
        const deletedBy = await Account.findOne({
            _id: product.deletedBy
        })
        product.createdBy = createdBy ?.fullName;
        product.updatedBy = updatedBy ?.fullName;
        product.deletedBy = deletedBy ?.fullName;
    }

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sản phẩm nổi bật",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    });
}