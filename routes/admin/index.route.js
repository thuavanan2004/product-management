const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoutes = require("./products-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const orderManagementRoutes = require("./order-management.route");
const settingsRoutes = require("./setting.route");
const blogsRoutes = require("./blog.route");

const systemConfig = require("../../config/system");
const authMiddlewares = require("../../middlewares/admin/auth.middleware");


module.exports = (app) => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`;

    app.use(PATH_ADMIN + "/dashboard", authMiddlewares.requireAuth, dashboardRoute);

    app.use(PATH_ADMIN + "/products", authMiddlewares.requireAuth, productRoute);

    app.use(PATH_ADMIN + "/products-category", authMiddlewares.requireAuth, productCategoryRoutes);

    app.use(PATH_ADMIN + "/roles", authMiddlewares.requireAuth, roleRoutes);

    app.use(PATH_ADMIN + "/accounts", authMiddlewares.requireAuth, accountRoutes);

    app.use(PATH_ADMIN + "/auth", authRoutes);

    app.use(PATH_ADMIN + "/order-management", authMiddlewares.requireAuth, orderManagementRoutes);

    app.use(PATH_ADMIN + "/settings", authMiddlewares.requireAuth, settingsRoutes);

    app.use(PATH_ADMIN + "/blogs", authMiddlewares.requireAuth, blogsRoutes);

};