const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require("mongoose-delete");

const Course = new Schema({
    name: {type: String, maxlength : 255},
    description: {type: String, maxlength: 600},
    image: {type: String, maxlength: 255},
    createAt:{type: Date, default: Date.now},
    updateAt:{type: Date, default: Date.now},
    slug: {type: String, slug: 'name', unique:true}
})

// Add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, {overrideMethods: 'all'});

module.exports  = mongoose.model('Course', Course);