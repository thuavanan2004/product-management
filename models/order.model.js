const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: String,
    cartId: String,
    userInfo: {
        fullName: String,
        phone: String,
        address: String
    },
    products: [{
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number
    }, ],
    paymentMethod: String,
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;