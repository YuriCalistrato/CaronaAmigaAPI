// Inbox.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var inboxSchema = {}
// Schema -> Ride :

msgSchema =  mongoose.Schema({
    inbox_id: { type: String, unique : true, required: true,dropDups: true },
    owner_id: Number,
    
    messages: [], // Chat Msgs
    ride_messages: [], // System Msgs

    created_at: Date
});

 module.exports = msgSchema;
// =======END=======