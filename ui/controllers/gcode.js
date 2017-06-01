/**
 * Created by micahfitzgerald on 4/13/17.
 */
var mongoose = require("mongoose");
var Image = mongoose.model("Image");
var Machine = mongoose.model("Machine");
var Material = mongoose.model("Material");
var zerorpc = require("zerorpc");
var ObjectID = require('mongodb').ObjectID


var client = new zerorpc.Client();

client.connect("tcp://gcode:4242");

exports.generate = function(req, res, next) {
    console.log(req.params);
    Promise.all([Image.findOne({
            _id: new ObjectID(req.query.image_id)
        }),
        Machine.findOne({
            _id: new ObjectID(req.query.machine_profile_id)
        }),
        Material.findOne({
            _id: new ObjectID(req.query.material_profile_id)
        })
    ]).then((docs) => {
        var [image, machine, material] = docs.map((mod) => {return mod.toObject()});
        image.base64 = image.imageRaw.toString('base64');
        delete image.imageRaw;
        let offset = [0,0];
        let final_dimensions = [parseFloat(req.query.dimension_x), parseFloat(req.query.dimension_y)]
        client.invoke("generate", image, machine, material,final_dimensions, offset, function(err, ret, more) {
            res.end(ret);
        });
    });
}