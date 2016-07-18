// User.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var userSchema = {}
// Schema -> User :

userSchema =  mongoose.Schema({
    email: {type: String, unique : true, required: true, dropDups: true},
    username: { type: String, required : true},
    picture: String,
    reputation_level: Number,
    type: Number, //type 0 = Usuário Normal, type 1 = Administrador

    friends: [String], // Friends IDs

    last_signin: Date,
    created_at: Date,

    // Settings

    slots: Number,
    type_car: Number,
    color: String,
    plate: String,
    extra: String

});

 module.exports =  userSchema;
// =======END=======