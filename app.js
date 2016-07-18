// App.Js

const imports = require('./config/imports');
var session = imports.getExpressSession();
var MongoStore = imports.getMongoSessionStore()(session);
var passport = imports.getPassport();
var cors = imports.getCors();

// Variables

var app = require('./config/environment');
var db = require('./config/database');

// Controllers

var ride = require('./controllers/ride');
var main = require('./controllers/main');
var user = require('./controllers/user');
//var auth = require('./controllers/auth');
//, 'auth' : auth
var controllers = {'ride' : ride,'main':main,'user':user};

// DataBase Startup
db.connect();


var corsOptions = {
  origin: '*'
};


app.use(cors(corsOptions));
// Middlewares
app.use(session({
    secret: 'pineapple',
    resave: true,
    saveUninitialized: true,
    /*store: new MongoStore({ url: db.session_serverUrl })*/
    store: new MongoStore({ url: 'mongodb://ecoride:ifrn123@ds055525.mongolab.com:55525/ecoridesession'})
}));
app.use(passport.initialize());
app.use(passport.session());

// Fix many imports through too much files
var mongoose = imports.getMongoose();
var userSchema = require('./models/user');
var User = mongoose.model('User',userSchema);

passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Routes
// --

app.use('/home',main);
app.use('/rides',ride);
app.use('/user',user);

//app.use('/auth',auth);

// --

process.on('exit', function () {
    db.disconnect();
    console.log("[Server] Offline.");
});

process.on('uncaughtException', function(ex) {
    console.log(ex);
});

module.exports = app;