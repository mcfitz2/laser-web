/**
 * Created by micahfitzgerald on 4/20/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sizeOf = require('image-size');
var ExifImage = require('exif').ExifImage;

var mimeTypes = {
    "png": "image/png",
    "svg": "image/svg+xml"
}
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB file size limit
var imageSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },

    width: {
        type: Number,
        default: 0,
        min: [0, 'width cannot be negative']
    },
    height: {
        type: Number,
        default: 0,
        min: [0, 'Height cannot be negative']
    },
    imageRaw: {
        type: Buffer,
        required: [true, "no image data was provided"],
        validate: {
            validator: function(v) {
                return v.byteLength < MAX_FILE_SIZE;
            },
            message: `File size must be less than ${MAX_FILE_SIZE}`
        }
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    type: {
        type: String,
        enum: [Object.keys(mimeTypes), `File type must be one of these mimetypes: ${Object.values(mimeTypes).join(',')}`],
        required: true

    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
imageSchema.virtual('url').get(function() {
    return "/image/" + this._id + "/file";
});
imageSchema.pre("save", function(next) {
    var doc = this;
    var dimensions = sizeOf(doc.imageRaw);
    doc.width = dimensions.width;
    doc.height = dimensions.height;
    doc.type = mimeTypes[dimensions.type];
    next();
});
module.exports = imageSchema;