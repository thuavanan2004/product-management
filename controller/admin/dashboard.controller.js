module.exports.index = (req, res) => {
    res.render("admin/pages/dashboard", {
        pageTitle: "Trang tổng quan"
    });
}