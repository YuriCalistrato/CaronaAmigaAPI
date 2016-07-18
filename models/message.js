// Message.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var msgSchema = {}
// Schema -> Message :

msgSchema =  mongoose.Schema({
    msg_id: { type: String, unique : true, required: true,dropDups: true },

    ride_id: Number,
    owner_id: Number,
    receiver_id: Number,
    value: String,

    created_at: Date
});

 module.exports = msgSchema;
// =======END=======