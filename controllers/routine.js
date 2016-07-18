var imports = require('../config/imports');
//============================
var express = imports.getExpress();
var controller = express.Router();
//============================

// Logger
controller.use(function(req, res, next) {

    // log each request to the console
    console.log("Method > "+req.method, " | Internal Service path >"+req.url, " |  Services Req. Path >"+req.baseUrl, " | Requester >"+req.ip );

    // continue doing what we were doing and go to the route
    next(); 
});

/* GET home page. */
controller.get('/', function(req, res) {
  res.status( 200).json({ message: "HelloWorld" });
});
/* end */

module.exports = controller;