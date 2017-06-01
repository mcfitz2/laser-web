var express = require('express')
var app = express()

var mongoose = require('mongoose');


var db = mongoose.connect('mongodb://micah:cl0ser2g0d@ds111851.mlab.com:11851/laserthing').then(function () {
    var Image = mongoose.model('Image', require('./models/image.js'));
    var Material = mongoose.model('Material', require('./models/material.js'));
    var Machine = mongoose.model('Machine', require('./models/machine.js'));


    app.use("/js", express.static('js'))
    app.use("/css", express.static('css'))

    app.use('/image', require("./routes/images.js"))
    app.use('/gcode', require("./routes/gcode.js"))
    app.use('/machine', require("./routes/machines.js"))
    app.use('/material', require("./routes/materials.js"))
    app.use('/user', require("./routes/users.js"))
    app.use("/", require("./routes/ui.js"))

    app.listen(process.env.HTTP_PORT, function () {
        console.log('Example app listening on port ' + process.env.HTTP_PORT + '!')
    });
}).catch(function(err) {
    console.log(err);
});