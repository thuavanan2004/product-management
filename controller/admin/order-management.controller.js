const Role = require("../../models/role.model")
const Order = require("../../models/order.model")
const Account = require("../../models/account.model")
const Product = require("../../models/product.model")

const moment = require("moment");

// const moment = require("moment");
 
// [GET] /admin/order-management
module.exports.index = async (req, res) => {
    try{
        const account = await Account.findOne({
            token: req.cookies.token
        })
        const role = await Role.findOne({
            _id: account.role_id
        })
        const orders = await Order.find();

        for (const order of orders) {
            let totalPrice = 0;
            let quantity = 0;
            // Sử dụng for...of để lặp qua các sản phẩm trong đơn hàng
            for (const product of order.products) {
                const productFind = await Product.findOne({
                    _id: product.product_id,
                    deleted: false
                }).select("title thumbnail");

                if (productFind) {
                    product.title = productFind.title;
                    product.thumbnail = productFind.thumbnail;
                    product.priceNew = product.price - (product.price * product.discountPercentage / 100);
                    product.totalPrice = product.quantity * product.priceNew;
                    totalPrice += product.totalPrice;
                    quantity += product.quantity;
                }
            }
            order.totalPrice = totalPrice;
            order.quantity = quantity;
            order.createdAtFormat = moment(order.createdAt).startOf('day').fromNow();
            
        }
        
        res.render("admin/pages/order-management/index", {
            pageTitle: "Quản lý đơn hàng",
            role: role,
            orders: orders
        })
    }catch {
        res.redirect("back");
    }
} 