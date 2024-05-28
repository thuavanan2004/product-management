const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");


// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });

    cart.totalPrice = 0;

    for (const item of cart.products) {
        const infoProduct = await Product.findOne({
            _id: item.product_id
        }).select("thumbnail title price discountPercentage stock slug");

        infoProduct.priceNew = (infoProduct.price * (100 - infoProduct.discountPercentage)/100).toFixed(0);

        infoProduct.totalPrice = infoProduct.priceNew * item.quantity;

        cart.totalPrice += infoProduct.totalPrice;

        item.infoProduct = infoProduct;
    }

        res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    
    try{
        const cartId = req.cookies.cartId;
        const userInfo =  req.body;

        const cart = await Cart.findOne({
            _id: cartId
        });
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
    
        res.redirect(`/checkout/success/${order.id}`);
    }catch {
        res.redirect("back");
        return;
    }
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try{
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
            item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
            item.totalPrice = item.priceNew * item.quantity;
            order.totalPrice += item.totalPrice
        }
    
            res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng",
            order: order
        });

    } catch {
        res.redirect("back");
        return;
    }
}