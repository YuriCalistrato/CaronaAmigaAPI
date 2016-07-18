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

controller.get('/:email', function(req, res) {
  User.find({email: req.params.email}, function (err, user){
    if(err){
      console.error(err);
      res.status(500);
    }

    collection = [];
    user ? collection.push(user) : res.status(404);
    res.status(200).json(collection);
  })
});

controller.post('/', function(req, res,next) {
  var current_user = new User();

  req.body.email ? current_user.email = req.body.email : current_user.email = null;
  req.body.username ? current_user.username = req.body.username : current_user.username = null;
  req.body.picture ? current_user.picture = req.body.picture : current_user.picture = null;
  req.body.friends ? current_user.friends = req.body.friends : current_user.friends = null;

  req.body.last_signin ? current_user.last_signin = req.body.last_signin : current_user.last_signin = null;

  req.body.type ? current_user.type = req.body.type : current_user.type = 0;

  current_user.created_at = new Date();

User.findOne({email: current_user.email}, function (err, user){
    if(err){
      console.error(err);
      res.status(500);
    }

  if (user == null) {
    current_user.save(function (err,user){
          if(err){
            console.error(err);
            return res.status(500);
          } 
        })
    res.status(200);
  } else {
    res.send("Email já cadastrado");
    res.status(500);
  }  
    })
});

//Editar Informações do usuário
controller.put('/editar/:email', function(req, res){

   // Get our REST or form values. These rely on the "name" attributes
    var username = req.body.username;
    var picture = req.body.picture;
    var slots = req.body.slots;
    var type_car = req.body.type_car;
    var color = req.body.color;
    var plate = req.body.plate;
    var extra = req.body.extra;    

    User.update({email: req.params.email}, {
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
controller.delete('/remover/:email', function(req, res, next) {
  User.remove({email: req.params.email}, function (err, current_user){
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