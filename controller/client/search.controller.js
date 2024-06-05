const Product = require("../../models/product.model");
const numeral = require("numeral")

// [GET] /search/
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    const regexKeyword = new RegExp(keyword, "i")
    const products = await Product.find({
        deleted: false,
        status: "active",
        title: regexKeyword
    })
    
    for (const product of products) {
        product.priceOld = numeral(product.price).format('0,0');
        product.priceNew = numeral((product.price * (100 - product.discountPercentage) / 100).toFixed(0)).format('0,0');
    }
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: products
    });
}