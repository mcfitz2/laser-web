/**
 * Created by micahfitzgerald on 4/13/17.
 */


var express = require('express')
var router = express.Router()
var mongoose = require("mongoose");
var Material = mongoose.model("Material");
router.post('/', function (req, res) {
    return 500;
});
router.patch("/:id", function(req, res) {

});
router.get("/:id", function (req, res) {
    Material.findById(mongoose.Types.ObjectId(req.params.id), function(err, material) {
        res.json(material);
    });
});
router.get("/", function (req, res) {
    Material.find({}, function(err, materials) {
        res.json(materials);
    });
});
module.exports = router