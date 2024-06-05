const Product = require("../../models/product.model");
const Blog = require("../../models/blog.model");
const numeral = require('numeral');
const moment = require("moment")

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product
        .find({
            deleted: false,
            status: "active",
            featured: "1"
        })
        .select("-description")
        .limit(4)
    for (const product of productsFeatured) {
        product.priceOld = numeral(product.price).format('0,0');
        product.priceNew = numeral((product.price * (100 - product.discountPercentage) / 100).toFixed(0)).format('0,0');
    }

    const productsNew = await Product
        .find({
            deleted: false,
            status: "active"
        })
        .select("-description")
        .limit(4)

    for (const product of productsNew) {
        product.priceOld = numeral(product.price).format('0,0');
        product.priceNew = numeral((product.price * (100 - product.discountPercentage) / 100).toFixed(0)).format('0,0');
    }

    const blogs = await Blog.find({
        deleted: false
    }).limit(5).select("title thumbnail createdAt slug")
    for (const blog of blogs) {
        blog.createdAtFormat = moment(blog.createdAt).format("L")
    }

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: productsFeatured,
        productsNew: productsNew,
        blogs: blogs
    });
}