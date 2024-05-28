const SettingGeneral = require("../../models/setting-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    if (!res.locals.role.permissions.includes("setting-general_edit")) {
        res.send("Không có quyền truy cập!");
        return;
    }
    const settingGeneral = await SettingGeneral.findOne({});
    if (settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }
    req.flash("success", "Cập nhật thông tin website thành công!");
    res.redirect("back");
}