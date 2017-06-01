/**
 * Created by micahfitzgerald on 4/20/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var machineSchema = new Schema({
    name: String,
    travel_rate: {type:Number, min:0},
    start_code: {type:String, default:"M106 S%d"},
    end_code: {type:String, default:"M107"},
    dot_size: {type:Number, default:0.1},
    prefix: {type:String, default:"G28 X\nG28 Y\n"},
    postfix: {type:String, default:"G28 X\nG28 Y\n"}
});
module.exports = machineSchema;