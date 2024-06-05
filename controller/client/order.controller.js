const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const numeral = require('numeral');
const getApiProvince = require("../../services/getProvince");


// [GET] /order/info
module.exports.info = async (req, res) => {
    const dataProvince = await getApiProvince.getProvince();

    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });

    cart.totalPrice = 0;

    for (const item of cart.products) {
        const infoProduct = await Product.findOne({
            _id: item.product_id
        }).select("thumbnail title price discountPercentage stock slug");

        infoProduct.priceNew = (infoProduct.price * (100 - infoProduct.discountPercentage) / 100).toFixed(0);

        infoProduct.totalPrice = numeral(infoProduct.priceNew * item.quantity).format('0,0');

        cart.totalPrice += infoProduct.priceNew * item.quantity;

        item.infoProduct = infoProduct;
    }
    cart.totalPriceFormat = numeral(cart.totalPrice).format('0,0');


    res.render("client/pages/order/info", {
        pageTitle: "Thông tin đơn hàng",
        cartDetail: cart,
        dataProvince: dataProvince
    });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {

    try {
        const cartId = req.cookies.cartId;
        const userInfo = req.body;

        const cart = await Cart.findOne({
            _id: cartId
        });
        const address = userInfo.city_id.split("-")[1] + ", " + userInfo.district_id.split("-")[1] + ", " + userInfo.ward_id.split("-")[1] + ", " + userInfo.address;
        userInfo.address = address;
        let products = [];
        cart.totalPrice = 0;
        for (const item of cart.products) {
            const infoProduct = await Product.findOne({
                _id: item.product_id
            })

            const objectProduct = {
                product_id: item.product_id,
                price: infoProduct.price,
                discountPercentage: infoProduct.discountPercentage,
                quantity: item.quantity,
            };

            products.push(objectProduct);
        }
        const objOrder = {
            // user_id: String,
            cartId: cartId,
            userInfo: userInfo,
            products: products
        }

        const order = new Order(objOrder);
        await order.save();
        await Cart.updateOne({
            _id: cartId
        }, {
            products: []
        });

        res.redirect(`/order/payment/${order.id}`);
    } catch {
        res.redirect("back");
        return;
    }
}

// [GET] /checkout/payment/:orderId
module.exports.payment = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            _id: orderId
        });

        order.totalPrice = 0;
        for (const item of order.products) {
            const infoProduct = await Product.findOne({
                _id: item.product_id
            }).select("thumbnail title price discountPercentage stock slug");

            item.thumbnail = infoProduct.thumbnail;
            item.title = infoProduct.title;
            item.priceNew = numeral((item.price * (100 - item.discountPercentage) / 100).toFixed(0)).format('0,0');

            item.totalPrice = numeral((item.price * (100 - item.discountPercentage) / 100).toFixed(0) * item.quantity).format("0,0");
            order.totalPrice += (item.price * (100 - item.discountPercentage) / 100).toFixed(0) * item.quantity
        }
        order.totalPrice = numeral(order.totalPrice).format("0,0");

        res.render("client/pages/order/payment", {
            pageTitle: "Chọn phương thức thanh toán",
            order: order
        });
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra khi tải trang phương thức thanh toán.");
        res.redirect("/cart");
    }
};
// [POST] /checkout/payment/:orderId
module.exports.paymentPost = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;
        const {
            paymentMethod
        } = req.body;
        console.log(req.body)
        await Order.updateOne({
            _id: orderId
        }, {
            $set: {
                paymentMethod,
                status: 'paid'
            }
        });
        res.redirect(`/order/success/${orderId}`);
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra khi chọn phương thức thanh toán.");
        res.redirect(`/checkout/payment/${orderId}`);
    }
};

// [GET] /order/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            _id: orderId
        });

        order.totalPrice = 0;
        for (const item of order.products) {
            const infoProduct = await Product.findOne({
                _id: item.product_id
            }).select("thumbnail title price discountPercentage stock slug");

            item.thumbnail = infoProduct.thumbnail;
            item.title = infoProduct.title;
            item.priceNew = numeral((item.price * (100 - item.discountPercentage) / 100).toFixed(0)).format('0,0');

            item.totalPrice = numeral((item.price * (100 - item.discountPercentage) / 100).toFixed(0) * item.quantity).format("0,0");
            order.totalPrice += (item.price * (100 - item.discountPercentage) / 100).toFixed(0) * item.quantity
        }
        order.totalPrice = numeral(order.totalPrice).format("0,0");

        res.render("client/pages/order/success", {
            pageTitle: "Đặt hàng",
            order: order
        });

    } catch {
        res.redirect("back");
        return;
    }
}