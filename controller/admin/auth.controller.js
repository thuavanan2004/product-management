const Account = require("../../models/account.model");
const md5 = require("md5");
const {prefixAdmin} = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login");
}

// [POST] /admin/auth/login
module.exports.loginPost = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const response = await Account.findOne({
        email: email,
        deleted: false
    });
    if(!response){
        req.flash("error", "Email đăng nhập không tồn tại !");
        res.redirect("back");
        return;
    }
    
    if(md5(password) != response.password){
        req.flash("error", "Sai mật khẩu !");
        res.redirect("back");
        return;
    }

    if(response.status != "active"){
        req.flash("error", "Tài khoản của bạn đã bị khóa !");
        res.redirect("back");
        return;
    }

    res.cookie("token", response.token);
    res.redirect(`${prefixAdmin}/dashboard`);
    req.flash("success", "Đăng nhập thành công"); 
   
}

// [POST] /admin/auth/logout
module.exports.logout = async(req, res) => {
    res.clearCookie("token");
    res.redirect(`${prefixAdmin}/auth/login`);
}
