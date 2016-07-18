// Ride.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var rideSchema = {}
// Schema -> Ride :

rideSchema =  mongoose.Schema({
    ride_id: { type: String, unique : true, required: true,dropDups: true },
    user: String,

    origin: String,
    destin: String,
    slots: Number,
    date: Date,
    
    friendsSolicitantes: [String], // Friends IDs
    friendsNaCarona: [String], // Friends IDs



    //type: Number, // Request or Offer -> 0 : Request, 1 : Offer

    comments: 
    [{ 
        author: String,
        body: String,
        date: Date,
        votes: Number,
        rating: Number 
    }],
    
    created_at: Date,
    
    meta: Boolean
});

 module.exports = rideSchema;
// =======END=======