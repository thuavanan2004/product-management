const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: String,
    updatedBy: String,
    deletedAt: Date,
    deletedBy: String,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    featured: {
        type: String,
        default: "0"
    },
}, {
    timestamps: true
})

const Blog = mongoose.model("Blog", blogSchema, "blogs");

module.exports = Blog;