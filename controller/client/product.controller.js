const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const numeral = require('numeral');

// [GET] /products/
module.exports.index = async (req, res) => {
    const find = {
        status: "active",
        deleted: false
    }
    const price_from = parseInt(req.query.price_from);
    const price_to = parseInt(req.query.price_to);
    if (price_from || price_to) {
        find.price = {
            $gte: price_from,
            $lte: price_to
        }
    }
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const sort = {};
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
    }

    const products = await Product.find(find).sort(sort)
    for (const product of products) {
        product.priceOld = numeral(product.price).format('0,0');
        product.priceNew = numeral((product.price * (100 - product.discountPercentage) / 100).toFixed(0)).format('0,0');
    }
    res.render("client/pages/products/index", {
        pageTitle: "Đồng hồ",
        products: products
    });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug: slug
        })
        const category = await ProductCategory.findOne({
            _id: product.product_category_id,
            deleted: false,
            status: "active"
        });
        product.category = category;

        product.priceOld = numeral(product.price).format('0,0');
        product.priceNew = numeral((product.price * (100 - product.discountPercentage) / 100).toFixed(0)).format('0,0');

        if (product) {
            res.render("client/pages/products/detail", {
                pageTitle: product.title,
                product: product
            });
        } else {
            res.redirect("back");
        }
    } catch {
        res.redirect("back")
    }

}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const find = {
        deleted: false,
        status: "active",
    }
    const price_from = parseInt(req.query.price_from);
    const price_to = parseInt(req.query.price_to);
    if (price_from || price_to) {
        find.price = {
            $gte: price_from,
            $lte: price_to
        }
    }
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const sort = {};
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
    } else {
        sort.position = "desc"
    }

    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false,
        status: "active"
    })


    const getSubCategory = async (parent_id) => {
        let allSubs = []
        const listSub = await ProductCategory
            .find({
                deleted: false,
                status: "active",
                parent_id: parent_id.id
            })
            .select("id title")
        allSubs = [...listSub]
        for (const sub of allSubs) {
            const childs = await getSubCategory(sub)
            allSubs = [...allSubs, ...childs]
        }
        return allSubs;
    }

    const listSubCategory = await getSubCategory(category);
    const listIdSubCategory = listSubCategory.map(item => item.id)
    find.product_category_id = {
        $in: [category.id, ...listIdSubCategory]
    }
    const products = await Product.find(find).sort(sort)

    for (const product of products) {
        product.priceOld = numeral(product.price).format('0,0');
        product.priceNew = numeral((product.price * (100 - product.discountPercentage) / 100).toFixed(0)).format('0,0');
    }

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: products
    });
}