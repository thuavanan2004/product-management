const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");


module.exports.cart = async (req, res, next) => {
    
    if(!req.cookies.cartId){
        const tokenUser = req.cookies.tokenUser;

        const cart = new Cart();
        await cart.save();
        res.cookie("cartId", cart.id)
        if(tokenUser){
            const user = await User.findOne({
                tokenUser: tokenUser
            })
            const existingCart  = await Cart.findOne({
                user_id: user.id
            })
            if(existingCart){
                await Cart.updateOne({
                    _id: cart.id
                }, {
                    products: existingCart.products
                })
                await Cart.deleteOne({
                    tokenUser: tokenUser
                })
            }
        }
        
    }
    next();
}


