// History.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var histSchema = {}
// Schema -> History :

histSchema =  mongoose.Schema({
    history_id: { type: String, unique : true, required: true,dropDups: true },
    user: String,
    rides: [ {ride_id: Number} ],
    created_at: Date
});

 module.exports = routSchema;
// =======END=======