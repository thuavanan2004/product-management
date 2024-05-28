const moogoose = require("mongoose");
const slug = require("mongoose-slug-updater");
moogoose.plugin(slug);

const productCategorySchema = new moogoose.Schema({
    title: String,
    parent_id:{
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug:{
        type: String,
        slug: "title",
        unique: true
    },
    deleted:{
        type: Boolean,
        default: false
    }, 
    deletedAt: Date,
    createdBy: String,
    updatedBy: String,
    deletedBy: String
},{
    timestamps: true,
});

const ProductCategory = moogoose.model("ProductCategory", productCategorySchema, "product-category");
module.exports = ProductCategory;
