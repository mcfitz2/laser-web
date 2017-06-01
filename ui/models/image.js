/**
 * Created by micahfitzgerald on 4/20/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sizeOf = require('image-size');
var ExifImage = require('exif').ExifImage;

var mimeTypes = {
    "png":"image/png",
    "svg":"image/svg+xml"
}
var imageSchema = new Schema({
    name: String,
    width: {type: Number, default: 0},
    height: {type: Number, default: 0},
    imageRaw: Buffer,
    date: {type: Date, default: Date.now},
    type: {type: String},
});
imageSchema.pre("save", function (next) {
    var doc = this;
    var dimensions = sizeOf(doc.imageRaw);
    doc.width = dimensions.width;
    doc.height = dimensions.height;
    doc.type = mimeTypes[dimensions.type];





    next();
});
module.exports = imageSchema;