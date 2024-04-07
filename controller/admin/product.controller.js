const Product = require("../../models/product.model");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const prefixAdmin = require("../../config/system");
const { request } = require("express");

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // filter
    const filterStatus = filterHelper(req);
    if(req.query.status){
        find.status = req.query.status;
    }
    // end filter
    // Search
    if(req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // End Search
    // Pagination
    
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);
    
    // End Pagination

    const products = await Product
    .find(find)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skipPage)
    .sort({position: "desc"});

    res.render("admin/pages/products", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: req.query.keyword,
        objectPagination: objectPagination
    });
}

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    },{
        status: status
    })
     
    req.flash("success", "Cập nhật trạng thái thành công !");

    res.redirect(`back`);
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    let ids = req.body.ids;
    ids = ids.split(", ");
    switch (type) {
        case "active":
        case "inactive": 
            await Product.updateMany({
                _id: {$in: ids}
            }, {
                status: type
            });
            break;
        case "delete-all":
            await Product.updateMany({
                _id: {$in: ids}
            }, {
                deleted: true
            })
            break;
        case "change-position":
            for(item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateMany({
                    _id: id
                }, {
                    position: position
                })
            }
            break;
        default: 
            break;
    }

    req.flash("success", "Cập nhật trạng thái thành công !");
    res.redirect(`back`);
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        deleted: true
    });
    req.flash("success", "Xóa sản phẩm thành công !");
    res.redirect(`back`);
}

module.exports.trash = async (req, res) => {
    const find = {
        deleted: true
    }
    const filterStatus = filterHelper(req);
    if(req.query.status){
        find.status = req.query.status;
    }
    if(req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    const countRecords = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req, countRecords);

    const products = await Product
    .find(find)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skipPage);;
    res.render("admin/pages/trash", {
        products: products,
        filterStatus: filterStatus,
        objectPagination: objectPagination
    });
}

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

module.exports.removeItem = async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne({
        _id: id
    })
    req.flash("success", "Xóa sản phẩm thành công !");
    res.redirect(`back`);
    
}

module.exports.create = (req, res) => {
    res.render("admin/pages/create.pug");
}

module.exports.createPost = async (req, res) => { 
    if(req.body){
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
    }
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }else{
        const countProduct = await Product.countDocuments({});
        req.body.position = countProduct + 1;
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const record = new Product(req.body);
    await record.save();
    res.redirect(`${prefixAdmin.prefixAdmin}/products`);
}

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id
    });
    res.render("admin/pages/edit", {
        pageTitle: "Trang chỉnh sửa sản phẩm",
        product: product
    });
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    await Product.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect(`${prefixAdmin.prefixAdmin}/products`);
}

module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    })
    res.render("admin/pages/detail", {
        pageTitle: "Trang chi tiết sản phẩm",
        product: product
    });
}