/**
 * Created by micahfitzgerald on 4/20/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var materialSchema = new Schema({
    name: String,
    power: {type: Number, min: 0, max: 255},
    feed_rate: {type: Number, min: 0, default: 300},
    category: {type: String}
});
module.exports = materialSchema;