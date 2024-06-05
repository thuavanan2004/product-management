const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const md5 = require("md5")

const sendEmailHelper = require("../../helpers/sendEmail.helper");
const generateHelper = require("../../helpers/generateToke.helper");



// [GET] /user/register
module.exports.register = (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const fullName = req.body.fullName;
    const password = req.body.password;
    const email = req.body.email;
    const tokenUser = generateHelper.generateToken(30);
    const existUser = await User.findOne({
        email: email,
        deleted: false
    })

    if (existUser) {
        req.flash("error", "Email đăng ký đã tồn tại!")
        res.redirect("back");
        return;
    }

    const userInfo = {
        fullName: fullName,
        email: email,
        password: md5(password),
        tokenUser: tokenUser,
    }

    const user = new User(userInfo)
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    if (user.password != md5(password)) {
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect("back");
        return;
    }

    if (user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }
    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    })

    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công !")
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu"
    })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại !");
        res.redirect("back");
        return;
    }

    const objForgotPassword = {
        email: email,
        otp: generateToken.generateNumber(6),
        expireAt: Date.now() + 3 * 60 * 1000,
    }
    const forgotPassword = new ForgotPassword(objForgotPassword);
    await forgotPassword.save();

    const subject = "Lấy lại mật khẩu";
    const text = `Mã OTP xác thực tài khoản của bạn là: ${forgotPassword.otp}. Mã OTP có hiệu lực trong vòng 3 phút. Vui lòng không cung cấp mã OTP này với bất kỳ ai.`;
    sendEmailHelper.sendEmail(email, subject, text);

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
};
// [POST] /user/password/forgot
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!forgotPassword) {
        req.flash("error", "Mã OTP không khớp");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");


}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu"
    });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;
    if (password != confirmPassword) {
        req.flash("error", "Mật khẩu xác nhận không khớp !")
        res.redirect("back");
        return;
    }
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })
    req.flash("success", "Đổi mật khẩu thành công!")
    res.redirect("/");
}

// [POST] /user/info
module.exports.info = async (req, res) => {
    const infoUser = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false
    }).select("-password");

    res.render("client/pages/user/info.pug", {
        pageTitle: "Thông tin tài khoản",
        infoUser: infoUser
    })
}