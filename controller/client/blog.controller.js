const Blog = require("../../models/blog.model")
const moment = require("moment");

// [GET] /blogs
module.exports.index = async (req, res) => {
    const blogsFeature = await Blog.find({
        deleted: false,
        featured: "1"
    })
    for (const blog of blogsFeature) {
        blog.date = moment(blog.createdAt).format("L");
    }
    const blogsNew = await Blog.find({
        deleted: false,
        featured: "0"
    })
    for (const blog of blogsNew) {
        blog.date = moment(blog.createdAt).format("L");
    }
    res.render("./client/pages/blogs/index.pug", {
        pageTitle: "Bài viết",
        blogsFeature: blogsFeature,
        blogsNew: blogsNew
    })
}

// [GET] /blogs/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const blog = await Blog.findOne({
        slug: slug,
        deleted: false
    })
    blog.date = moment(blog.createdAt).format('LT') + " : " + moment(blog.createdAt).format('L');

    const blogsNew = await Blog.find({
        deleted: false,
        featured: "0"
    })
    for (const blog of blogsNew) {
        blog.date = moment(blog.createdAt).format("L");
    }

    res.render("./client/pages/blogs/detail.pug", {
        pageTitle: blog.title,
        blogsNew: blogsNew,
        blog: blog
    })
}