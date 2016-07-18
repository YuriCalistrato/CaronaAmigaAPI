// Routine.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var routSchema = {}
// Schema -> Ride :

routSchema =  mongoose.Schema({
    rout_id: { type: String, unique : true, required: true,dropDups: true },
    ride_id: Number,
    user: String,

    started_at: Date,
    frequency: Number,

    created_at: Date
});

 module.exports = routSchema;
// =======END=======