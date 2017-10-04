//var images = [{path:"/Users/micahfitzgerald/Dropbox/Code/LASERPY/uploads/hoosiers frame.png", date:new Date(2017, 3, 1), name:"hoosiers frame.png"}];
var mongoose = require("mongoose");
var Image = mongoose.model("Image");

var path = require("path")
var formidable = require("formidable");
var fs = require("fs");


exports.createImage = function(req, res, next) {
    var form = new formidable.IncomingForm();
    var uploadedImage = null;
    form.on('fileBegin', function(name, file) {
        file.path = path.join(__dirname, '../uploads', file.name);
    });
    form.on('file', function(field, file) {
        console.log(file.name);
        let filename = path.join(__dirname, '../uploads', file.name);
        fs.readFile(filename, function(err, data) {
            if (err) {
                console.log(err);
            }
            uploadedImage = new Image({
                name: file.name,
                imageRaw: data
            });
            uploadedImage.save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                    res.end();
                } else {
                    res.json(uploadedImage);
                }
            });
        });
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    //form.on('end', function () {
    //  res.json(uploadedImage);

    //res.end('success');
    //});

    // parse the incoming request containing the form data
    form.parse(req);
}

exports.giveImageFile = function(req, res, next) {
    var image_id = parseInt(req.params.id);
    Image.findById(mongoose.Types.ObjectId(req.params.id), function(err, doc) {
        res.writeHead(200, {
            "Content-Type": doc.type,
            "Content-Length": doc.imageRaw.length,
        });
        res.end(doc.imageRaw, 'binary');
    });
}
exports.giveImageDetail = function(req, res, next) {
    let fields = Object.keys(Image.schema.paths).filter(function(key) {
        return key != "imageRaw"
    }).join(" ")
    Image.find({
        _id: req.params.id
    }, fields, function(err, image) {
        image.url = "/image/" + image._id + "/file";
        res.json(image);
    });
}
exports.listImages = function(req, res, next) {
    let fields = Object.keys(Image.schema.paths).filter(function(key) {
        return key != "imageRaw"
    }).join(" ")

    Image.find({}, fields, function(err, images) {
        console.log(images);
        res.json(images);
    });
}