//== Controller Header  ===========
  //== Imports. ==================
  var imports = require('../config/imports');

  var express = imports.getExpress();
  var parser = imports.getBodyParser();
  var mongoose = imports.getMongoose();
  var controller = express.Router();

  //== Plugins ( Middleware ). =======
  controller.use(parser.json());
  controller.use(parser.urlencoded({extended: true}));

//== Controller Header end ========

//== Models. ===================

var rideSchema = require('../models/ride');
var Ride = mongoose.model('Ride',rideSchema);
var seqSchema = require('../models/seq');
var Seq = mongoose.model('rideSeq',seqSchema);

//== Memory. ==================

var collection = [];

//== Routes & Logic. =============

controller.get('/', function(req, res) {
  // Select All
  Ride.find( function (err, rides) {
    if(err){
      console.error(err);
      res.status(500);
    } 
    // Set memory array,
    collection = rides;
    res.status(200).json(collection);
  });
});

//pega as informações da carona e do id
controller.get('/:email/:id(\\d+)/', function(req, res) {
  Ride.findOne({ride_id: req.params.id, user: req.params.email}, function (err, ride){
    if(err){
      console.error(err);
      res.status(500);
    }

    collection = [];
    ride ? collection.push(ride) : res.status(404);
    res.status(200).json(collection);
  })
});

//Pega todos os amigos com caronas ativas
controller.get('/:email/ativos', function(req, res) {
  Ride.find({user: req.params.email, meta: true}, function (err, ride){
    if(err){
      console.error(err);
      res.status(500);
    }

    collection = [];
    ride ? collection.push(ride) : res.status(404);
    res.status(200).json(collection);
  })
});

//pega tudo
controller.get('/:email/todos', function(req, res) {
  Ride.find({user: req.params.email}, function (err, ride){
    if(err){
      console.error(err);
      res.status(500);
    }

    collection = [];
    ride ? collection.push(ride) : res.status(404);
    res.status(200).json(collection);
  })
});

//Grava a carona nova
controller.post('/', function(req, res,next) {
  var current_ride = new Ride();

  req.body.user ? current_ride.user = req.body.user : current_ride.user = null ;

  req.body.origin ? current_ride.origin = req.body.origin : current_ride.origin = null;
  req.body.destin ? current_ride.destin = req.body.destin : current_ride.destin = null;
  req.body.slots ? current_ride.slots = req.body.slots : current_ride.slots = null;

  req.body.date ? current_ride.date = req.body.date : current_ride.date = null;

  //req.body.type ? current_ride.type = req.body.type : current_ride.type = null;
  req.body.meta ? current_ride.meta = req.body.meta : current_ride.meta = true;

  current_ride.created_at = new Date();

  // Sync forced flow for query and setting next ID
  var sequence = new Seq();
  sequence.nextId(Seq).next( function (rideId) {
    current_ride.ride_id = rideId;  
    current_ride.save(function (err,ride){
      if(err){
        console.error(err);
        return res.status(500);
      } 
    });
    //res.redirect('/rides');
    res.status(200);
  });  
});

/*
controller.post('/:id(\\d+)/', function(req, res, next) {
  Ride.findOne({ride_id: req.params.id}, function (err, current_ride){
    if(err){
      console.error(err);
      res.status(500);
    } 
    if(current_ride.length < 1)
      res.status(404);
    else
    {
      if (req.body.user) current_ride.user = req.body.user;
      if (req.body.origin) current_ride.origin = req.body.origin;
      if (req.body.destin) current_ride.destin = req.body.destin;
      if (req.body.slots) current_ride.slots = req.body.slots;
      if (req.body.date) current_ride.date = req.body.date;      
      Ride.update(current_ride);
    }
    res.status(200);
  });
});*/

//atualiza informações básicas da carona
controller.put('/editar/:email/:id/', function(req, res){

   // Get our REST or form values. These rely on the "name" attributes
   var origin = req.body.origin;
   var destin = req.body.destin;
   var date = req.body.date;
   var slots = req.body.slots;

   Ride.update({ride_id: req.params.id, user: req.params.email}, {
    origin: origin,
    destin: destin,
    date: date,
    slots: slots
  }, function(err, ride) {
    if (err) {
      res.send("Houve um problema para atualizar a carona: " + err);
    } 
  })

   collection = [];
   ride ? collection.push(ride) : res.status(404);
   res.status(200).json(collection);
 });

//Solicitar Carona
controller.put('/solicitarcarona/:email/:id/', function(req, res){

  var current_ride = new Ride();
  var solicitarNovo = true;
  var friend;
  current_ride.email = req.body.email; // email de quem tá pedindo

  Ride.findOne({ride_id: req.params.id, user: req.params.email, meta: true}, function (err, ride){

    current_ride.friendsSolicitantes = ride.friendsSolicitantes;

    current_ride.friendsSolicitantes.push(current_ride.email);

    for (friend in ride.friendsSolicitantes) {
      if (ride.friendsSolicitantes[friend] == current_ride.email) {
        current_ride.friendsSolicitantes = [];
        solicitarNovo = false;
        res.send("Você já se encontra na fila de espera!");
        break;   
      }
    }

    if (solicitarNovo == true) {   
      Ride.update({ride_id: req.params.id, user: req.params.email}, {
        friendsSolicitantes:  current_ride.friendsSolicitantes
      }, function(err, ride) {
        if (err) {
          res.send("Houve um problema para atualizar a carona: " + err);
        }
        collection = [];
        ride ? collection.push(ride) : res.status(404);
        res.status(200).json(collection); 
      })
    } else {
      res.send("Não validado!");
    }
  });
});

//Entrar Carona
controller.put('/entrarcarona/:email/:id/', function(req, res){

  var current_ride = new Ride();
  var entrarNovo = false;
  var friend;
  current_ride.email = req.body.email;

  Ride.findOne({ride_id: req.params.id, user: req.params.email,  meta: true}, function (err, ride){

    current_ride.friendsSolicitantes = ride.friendsSolicitantes;

    current_ride.friendsNaCarona = ride.friendsNaCarona;

    current_ride.slots = ride.slots;

    current_ride.friendsSolicitantes.remove(current_ride.email);

    for (friend in ride.friendsSolicitantes) {
      if (ride.friendsSolicitantes[friend] == current_ride.email) {
        if(ride.friendsNaCarona.length >= ride.slots) {
         res.send("Limite excedido!");
         break; 
       }
       current_ride.friendsNaCarona.push(current_ride.email);
       entrarNovo = true;
       break;   
     }
   }

   if (entrarNovo == true) {   
    Ride.update({ride_id: req.params.id, user: req.params.email}, {
      friendsSolicitantes:  current_ride.friendsSolicitantes,
      friendsNaCarona:    current_ride.friendsNaCarona
    }, function(err, ride) {
      if (err) {
        res.send("Houve um problema para atualizar a carona: " + err);
      }
      collection = [];
      ride ? collection.push(ride) : res.status(404);
      res.status(200).json(collection); 
    })
  } else {
    res.send("Não validado!");
  } 
});
});

//Sair Carona
controller.put('/saircarona/:email/:id/', function(req, res){

  var current_ride = new Ride();
  var sairNovo = false;
  var friend;
  current_ride.email = req.body.email;

  Ride.findOne({ride_id: req.params.id, user: req.params.email}, function (err, ride){

    current_ride.friendsNaCarona = ride.friendsNaCarona;

    current_ride.friendsNaCarona.remove(current_ride.email);
    
    if(current_ride.email == ride.user) {
      current_ride.friendsNaCarona = [];
      current_ride.friendsSolicitantes = [];
      current_ride.meta = false;
      sairNovo = true;
    } else {
      for (friend in ride.friendsNaCarona) {
        if (ride.friendsNaCarona[friend] == current_ride.email) {
          current_ride.friendsSolicitantes = ride.friendsSolicitantes;
          current_ride.meta = true;
          sairNovo = true;
          break;   
        }
      }
    }

    if (sairNovo == true) {   
      Ride.update({ride_id: req.params.id, user: req.params.email}, {
        friendsSolicitantes:  current_ride.friendsSolicitantes,
        friendsNaCarona:    current_ride.friendsNaCarona,
        meta: current_ride.meta
      }, function(err, ride) {
        if (err) {
          res.send("Houve um problema para atualizar a carona: " + err);
        }
        collection = [];
        ride ? collection.push(ride) : res.status(404);
        res.status(200).json(collection); 
      })
    } else {
      res.send("Não validado!");
    }
  });
});

//deleta a carona com o email cadastrado 
controller.delete('/remover/:email/:id/', function(req, res, next) {
  Ride.remove({ride_id: req.params.id, email: req.params.email}, function (err, current_ride){
    if(err){
      console.error(err);
      res.status(500);
    }    
    collection=[];
    /*collection.push({"Removido" : current_ride });
    res.redirect('/rides/'+req.params.id+'/');*/
    res.status(200);
  });
});


//============================
module.exports = controller;