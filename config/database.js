// DataBase Js

var imports = require('../config/imports');
var mongoose = imports.getMongoose();

// ========================
// Config Database
// ========================

// Urls
const dbServer = 'mongodb://ecoride:ifrn123@ds035250.mongolab.com:35250/ecoride' ;
const dbSessionServer = 'mongodb://ecoride:ifrn123@ds055525.mongolab.com:55525/ecoridesession';

// Instance
var db = { 
    /*connect: function() { mongoose.connect(dbServer); },*/
    connect: function() { mongoose.connect('mongodb://ecoride:ifrn123@ds035250.mongolab.com:35250/ecoride'); },
    disconnect: function() { mongoose.disconnect(); },
    serverUrl: function(){ return dbServer; },
    session_serverUrl: function(){ return dbSessionServer; }
};

// Attributes
db.attributes = {
    name: "Gerência do Banco de Dados",
    version: "1.2"
}

module.exports = db;