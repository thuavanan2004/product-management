const Blog = require("../../models/blog.model");
const Account = require("../../models/account.model");
const prefixAdmin = require("../../config/system");
const paginationHelper = require("../../helpers/pagination.helper");
const filterStatusHelper = require("../../helpers/filter.helper");

// [GET] /blogs
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const filterStatus = filterStatusHelper(req);
    const countRecords = await Blog.countDocuments({});
    const objectPagination = paginationHelper(req, countRecords);
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex
    }
    if (req.query.status) {
        find.status = req.query.status;
    }
    const blogs = await Blog.find(find)
        .select("-content")
        .limit(objectPagination.limitPage)
        .skip(objectPagination.skipPage)
        .sort(sort);;

    for (const blog of blogs) {
        const createdBy = await Account.findOne({
            _id: blog.createdBy
        })
        const updatedBy = await Account.findOne({
            _id: blog.updatedBy
        })
        const deletedBy = await Account.findOne({
            _id: blog.deletedBy
        })
        blog.createdBy = createdBy ?.fullName;
        blog.updatedBy = updatedBy ?.fullName;
        blog.deletedBy = deletedBy ?.fullName; 
    }

    res.render("./admin/pages/blogs/index", {
        pageTitle: "Bài viết",
        blogs: blogs,
        objectPagination: objectPagination,
        filterStatus: filterStatus
    })
}

// [GET] /blogs/create
module.exports.create = (req, res) => {
    res.render("./admin/pages/blogs/create", {
        pageTitle: "Tạo bài viết"
    })
}

// [POST] /blogs/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("blogs_create")) {
        res.send("Không có quyền truy cập");
        return;
    }
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề!");
        res.redirect("back");
        return;
    }
    if (req.body) {
        req.body.createdBy = res.locals.user.id;
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const countProduct = await Blog.countDocuments({});
        req.body.position = countProduct + 1;
    }
    const record = new Blog(req.body);
    await record.save();
    res.redirect(`${prefixAdmin.prefixAdmin}/blogs`);
}

// [PATCH] /blogs/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("blogs_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const status = req.params.status;
        const id = req.params.id;
        await Blog.updateOne({
            _id: id
        }, {
            status: status,
            updatedBy: res.locals.user.id,
            updatedAt: new Date()
        })
        req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");
        res.redirect("back");
    } catch {
        res.redirect("back");
        return;
    }

}
// [DELETE] /admin/blogs/changemulti
module.exports.changeMultiTrash = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("blogs_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const type = req.body.type;
        let ids = req.body.ids;
        ids = ids.split(", ");
        switch (type) {
            case "remove-all":
                await Blog.deleteMany({
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

// [PATCH] /blogs/change-multi
module.exports.changeMulti = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("blogs_edit")) {
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
                await Blog.updateMany({
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
                await Blog.updateMany({
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
                    await Blog.updateMany({
                        _id: id
                    }, {
                        position: position,
                        updatedBy: res.locals.user.id,
                        updatedAt: new Date()
                    })
                }
                break;
            case "recall-all":
                await Blog.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: false,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                })
            case "remove-all":
                await Blog.deleteMany({
                    _id: {
                        $in: ids
                    }
                })
            default:
                break;
        }
        res.redirect("back");
        req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");
    } catch {
        res.redirect("back");
        req.flash("error", "Cập nhật trạng thái sản phẩm thất bại!");
    }

}

// [DELETE] /blogs/delete
module.exports.delete = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("blogs_delete")) {
        res.send("Không có quyền truy cập");
        return;
    }
    try {
        const id = req.params.id;
        await Blog.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: res.locals.user.id
        })
        req.flash("success", "Xóa bài viết thành công");
        res.redirect("back");
    } catch {
        req.flash("error", "Xóa bài viết không thành công");
        res.redirect("back");
        return;
    }
}

// [GET] /blogs/detail
module.exports.detail = async (req, res) => {
    const idBlog = req.params.id;
    try {
        const blog = await Blog.findOne({
            _id: idBlog,
            deleted: false
        })
        res.render("./admin/pages/blogs/detail", {
            pageTitle: "Chi tiết bài viết",
            blog: blog
        })
    } catch {
        req.flash("error", "Truy cập vào chi tiết bài viết không thành công!")
        res.redirect("back");
    }

}

// [GET] /blogs/edit
module.exports.edit = async (req, res) => {
    const idBlog = req.params.id;
    try {
        const blog = await Blog.findOne({
            _id: idBlog,
            deleted: false
        })
        res.render("./admin/pages/blogs/edit", {
            pageTitle: "Chỉnh sửa bài viết",
            blog: blog
        })
    } catch {
        req.flash("error", "Không thể vào trang chỉnh sửa bài viết!")
        res.redirect("back");
    }
}


// [PATCH] /blogs/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const permissions = res.locals.role.permissions;
        if (!permissions.includes("blogs_edit")) {
            res.send("Không có quyền truy cập");
            return;
        }
        if (req.body) {
            req.body.updatedBy = res.locals.user.id;
        }
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const countProduct = await Blog.countDocuments({});
            req.body.position = countProduct + 1;
        }
        await Blog.updateOne({
            _id: id,
            deleted: false
        }, req.body)

        req.flash("success", "Chỉnh sửa bài viết thành không!");
        res.redirect(`${prefixAdmin.prefixAdmin}/blogs`);
    } catch {
        req.flash("error", "Chỉnh sửa bài viết thất bại!");
        res.redirect("back");
        return;
    }
}

// [PATCH] /blogs/trash
module.exports.trash = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("blogs_edit")) {
        res.send("Không có quyền truy cập");
        return;
    }
    const find = {
        deleted: true
    }
    const countRecords = await Blog.countDocuments({});
    const objectPagination = paginationHelper(req, countRecords);

    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex
    }

    const blogs = await Blog.find(find)
        .select("-content")
        .limit(objectPagination.limitPage)
        .skip(objectPagination.skipPage)

    for (const blog of blogs) {
        const deletedBy = await Account.findOne({
            _id: blog.deletedBy
        })
        blog.deletedBy = deletedBy ?.fullName;
    }

    res.render("./admin/pages/blogs/trash", {
        pageTitle: "Bài viết bị xóa",
        blogs: blogs,
        objectPagination: objectPagination,
    })
}

// [PATCH] /blogs/recall/:id
module.exports.recall = async (req, res) => {
    const id = req.params.id;
    try {
        const permissions = res.locals.role.permissions;
        if (!permissions.includes("blogs_edit")) {
            res.send("Không có quyền truy cập");
            return;
        }
        await Blog.updateOne({
            _id: id
        }, {
            deleted: false,
            updatedBy: res.locals.user.id,
            updatedAt: new Date()
        })
        req.flash("success", "Thu hồi bài viết thành công!")
        res.redirect(`${prefixAdmin.prefixAdmin}/blogs`);

    } catch {
        req.flash("error", "Thu hồi sản phẩm thất bại!")
        res.redirect("back");
    }
}


// [DELETE] /blogs/remove/:id
module.exports.remove = async (req, res) => {
    const id = req.params.id;
    try {
        const permissions = res.locals.role.permissions;
        if (!permissions.includes("blogs_delete")) {
            res.send("Không có quyền truy cập");
            return;
        }
        await Blog.deleteOne({
            _id: id
        })
        req.flash("success", "Đã xóa sản phẩm vĩnh viễn!");
        res.redirect("back");
    } catch {
        req.flash("error", "Xóa sản phẩm không thành công!");
        res.redirect("back");
    }
}