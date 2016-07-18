//== Controller Header  ===========
  //== Imports. ==================
  var imports = require('../config/imports');

  var express = imports.getExpress();
  var parser = imports.getBodyParser();
  var mongoose = imports.getMongoose();
  var controller = express.Router();
  var passport = imports.getPassport();
  var FacebookStrategy = imports.getPassportFacebookStrategy();

  //== Plugins ( Middleware ). =======

  controller.use(parser.json());
  controller.use(parser.urlencoded({extended: true}));

//== Controller Header end ========


//== Models. ===================

var userSchema = require('../models/user');
var User = mongoose.model('User',userSchema);
var seqSchema = require('../models/seq');
var Seq = mongoose.model('userSeq',seqSchema);


//== Passport Configuration. ==================
const cbUrl = "https://ecoride1.herokuapp.com/auth/facebook/callback";
passport.use(new FacebookStrategy(
{
 clientID: '952127641546969',
 clientSecret: "c9ab5cb9961e0cd4b404fffe64e54de0",
   callbackURL: cbUrl
   //callbackURL: "https://ecoride1.herokuapp.com/auth/facebook/callback"
 },
 function(accessToken, refreshToken, profile, callback) 
 {
    // Loggin Working
    User.findOne(
    {
      'social_id': {'social': 'facebook', 'value': profile.id}
    },  function(err, user) {
      if (err) {  return callback(err);  }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
              // Sequence generator
              var sequence = new Seq();
              user = new User({
                'user_id': profile.id,
                'social_id': [{'social': 'facebook', 'value': profile.id}],
                'username': profile.displayName,
                'accessToken': accessToken,
                'refreshToken': refreshToken
              });
              user.save(function (err,saved_user){
                if(err){
                  console.error(err);
                } else {
                  return callback(err, saved_user);
                }


              });
            } else {
              return callback(user);
            }
          });
  }));

//== Routes & Logic. =============

controller.get('/facebook', passport.authenticate('facebook') );

controller.get('/facebook/callback',passport.authenticate('facebook'),
  function(req, res) {
    console.log("Data from Callback: " + req)
    res.status(200).json(req.user);
  });

controller.get('/logout', function(req, res,next) {
  req.logout();
  res.status(200);
});  



//============================
module.exports = controller;