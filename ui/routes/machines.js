/**
 * Created by micahfitzgerald on 4/13/17.
 */


var express = require('express')
var router = express.Router()
var mongoose = require("mongoose");
var Machine = mongoose.model("Machine");

router.post('/', function (req, res) {
    return 500;
});
router.patch("/:id", function (req, res) {

});
router.get("/:id", function (req, res) {
    Machine.findById(mongoose.Types.ObjectId(req.params.id), function(err, machine) {
        res.json(machine);
    });
});
router.get("/", function (req, res) {
    Machine.find({}, function(err, machines) {
        res.json(machines);
    });
});
module.exports = router