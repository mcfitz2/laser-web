/**
 * Created by micahfitzgerald on 4/13/17.
 */
var express = require('express')
var router = express.Router()

var imageController = require("../controllers/images.js");
router.post('/', imageController.createImage);
router.get("/:id/file", imageController.giveImageFile);
router.get("/:id", imageController.giveImageDetail);
router.get("/", imageController.listImages);

module.exports = router