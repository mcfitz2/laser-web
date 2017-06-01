/**
 * Created by micahfitzgerald on 4/13/17.
 */
var express = require('express')
var router = express.Router()
var path = require("path");
router.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname, "../views/index.html"));
});

module.exports = router