/**
 * Created by micahfitzgerald on 4/13/17.
 */
/**
 * Created by micahfitzgerald on 4/13/17.
 */
var express = require('express')
var router = express.Router()
var request = require("request");
var gcodeController = require("../controllers/gcode.js");

router.use('/generate', gcodeController.generate);


module.exports = router;