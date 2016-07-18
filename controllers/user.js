var imports = require('../config/imports');
  //== Imports. ==================

var express = imports.getExpress();
var parser = imports.getBodyParser();
var mongoose = imports.getMongoose();
var controller = express.Router();

  //== Plugins ( Middleware ). =======
  controller.use(parser.json());
  controller.use(parser.urlencoded({extended: true}));

//== Controller Header end ========

//== Models. ===================

var userSchema = require('../models/user');
var User = mongoose.model('User',userSchema);


//== Memory. ==================

var collection = [];

//== Routes & Logic. =============

controller.get('/', function(req, res) {
  // Select All
  User.find( function (err, user) {
    if(err){
      console.error(err);
      res.status(500);
    } 
    // Set memory array,
    collection = user;
    res.status(200).json(collection);
  });
});

controller.get('/:user_id', function(req, res) {
  User.find({user_id: req.params.user_id}, function (err, user){
    if(err){
      console.error(err);
      res.status(500);
    }

    collection = [];
    user ? collection.push(user) : res.status(404);
    res.status(200).json(collection);
  })
});

// Session Start
controller.post('/', function(req, res,next) {
  var current_user = new User();

  //  Current User Build Up
  req.body.user_id ? current_user.email = req.body.user_id : current_user.user_id = 0;
  req.body.email ? current_user.email = req.body.email : current_user.email = null;
  req.body.username ? current_user.username = req.body.username : current_user.username = null;
  req.body.picture ? current_user.picture = req.body.picture : current_user.picture = null;
  req.body.friends ? current_user.friends = req.body.friends : current_user.friends = null;
  req.body.last_signin ? current_user.last_signin = req.body.last_signin : current_user.last_signin = null;
  req.body.type ? current_user.type = req.body.type : current_user.type = 0;


  User.findOne({email: current_user.email}, function (err, user){  
    if(err){
      console.error(err);
      res.status(500);
    }

    callbackUser = user;

    if (user == null) {
      current_user.created_at = new Date();
      current_user.save(function (err,user){
          if(err){
            console.error(err);
            return res.status(500);
          }
      })
    }

    res.status(200).json(callbackUser); 
  })

});

//Editar Informações do usuário
controller.put('/editar/:user_id', function(req, res){

   // Get our REST or form values. These rely on the "name" attributes
    var user_id = req.params.user_id;
    var username = req.body.username;
    var picture = req.body.picture;
    var slots = req.body.slots;
    var type_car = req.body.type_car;
    var color = req.body.color;
    var plate = req.body.plate;
    var extra = req.body.extra;    

    User.update({user_id: req.params.user_id}, {
      user_id: user_id,
      username: username,
      picture: picture,
      slots: slots,  
      type_car: type_car,
      color: color,
      plate: plate,
      extra: extra
      }, function(err, user) {
          if (err) {
            res.send("Houve um problema na hora de editar os dados do usuário: " + err);
          } 
    })

    collection = [];
    user ? collection.push(user) : res.status(404);
    res.status(200).json(collection);
});

//Remove a conta do usuário no sistema 
controller.delete('/remover/:user_id', function(req, res, next) {
  User.remove({user_id: req.params.user_id}, function (err, current_user){
    if(err){
      console.error(err);
      res.status(500);
    }    
    collection=[];
    current_user ? collection.push(current_user) : res.send("Usuário Removido!");
    /*collection.push({"Removido" : current_ride });
    res.redirect('/rides/'+req.params.id+'/');*/
    res.status(200).json(collection);
  });
});

module.exports = controller;