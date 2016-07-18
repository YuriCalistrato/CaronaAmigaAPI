// Funções para imports externos a aplicação ( Da propria maquina virtual )

module.exports = {
    getExpress: function() {
        var express = require('../node_modules/express/index.js');
        return express;
    },
    getBodyParser: function() {
        var bodyParser = require('../node_modules/body-parser/index.js');
        return bodyParser;
    },
    getCookieParser: function(){
        var cookieParser = require('../node_modules/cookie-parser/index.js');
        return cookieParser;
    },
    getMongoose: function(){
        var mongoose = require('../node_modules/mongoose/index.js');
        return mongoose;
    }, // PASSPORT AUTH -----------------------------------------
    getPassport: function(){
        var passport = require('../node_modules/passport/lib/index.js');
        return passport;
    },
    getPOAuth: function(){
        var oauth = require('../node_modules/passport-oauth/lib/index.js').OAuth2Strategy;
        return oauth;
    },
    getPassportFacebookStrategy: function(){
        var pface = require('../node_modules/passport-facebook/lib/index.js').Strategy;
        return pface;
    },
    getPassportGoogle: function(){
        var pface = require('../node_modules/passport-google-oauth2/lib/index.js').Strategy;
        return pface;
    }, // PASSPORT AUTH -----------------------------------------
    getExpressSession: function(){
        var es = require('../node_modules/express-session/index.js');
        return es;
    },
    getMongoSessionStore: function(){
        var msstore = require('../node_modules/connect-mongo/index.js');
        return msstore;
    }

};