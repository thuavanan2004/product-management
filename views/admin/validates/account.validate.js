const Account = require("../../../models/account.model");

module.exports.createPost = async (req, res, next) => {
    if(!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tiêu đề ");
        res.redirect('back');
        return;
    }

    if(req.body.fullName.length <  5) {
        req.flash("error", "Vui lòng nhập ít nhất 5 ký tự!");
        res.redirect("back");
        return;
    }
    const account = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    
    if(account) {
        req.flash("error", "Email đã được sử dụng !");
        res.redirect("back");
        return;
    }

   
    if(req.body.password.length <  5) {
        req.flash("error", "Vui lòng nhập ít nhất 5 ký tự!");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.editPatch = async (req, res, next) => {
    if(!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tiêu đề ");
        res.redirect('back');
        return;
    }

    if(req.body.fullName.length <  5) {
        req.flash("error", "Vui lòng nhập ít nhất 5 ký tự!");
        res.redirect("back");
        return;
    }
    
    if(req.body.password.length <  5) {
        req.flash("error", "Vui lòng nhập ít nhất 5 ký tự!");
        res.redirect("back");
        return;
    }
    next();
}
