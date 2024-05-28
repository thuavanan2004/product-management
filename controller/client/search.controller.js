const Product = require("../../models/product.model");

// [GET] /search/
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    const regexKeyword = new RegExp(keyword, "i")
    const products = await Product.find({
        deleted: false,
        status: "active",
        title: regexKeyword
    })
    
    for (const item of products) {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: products
    });
}