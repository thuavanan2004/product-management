const homeRoutes = require("./home.route");
const productsRoutes = require("./products.route");
const searchRouters = require("./search.route");
const cartRouters = require("./cart.route");
const orderRouters = require("./order.route");
const userRouters = require("./user.route");
const blogRouters = require("./blog.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingsMiddleware = require("../../middlewares/client/setting.middleware");


module.exports = (app) => {

    app.use(categoryMiddleware.category);
    app.use(userMiddleware.infoUser);
    app.use(cartMiddleware.cart);
    app.use(settingsMiddleware.settingsGeneral);

    app.use("/", homeRoutes);

    app.use("/products", productsRoutes);

    app.use("/search", searchRouters);

    app.use("/cart", cartRouters);

    app.use("/order", orderRouters);

    app.use("/user", userRouters);

    app.use("/blogs", blogRouters);
}