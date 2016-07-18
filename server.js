// Imports

var http = require('http');
var app = require('./app');

// Vars

var server = http.createServer(app);
process.title = "EcoRide Server";

// Functions
//setInterval(function() { process.stdout.write("[Memory] "+JSON.stringify( process.memoryUsage() )+'\r'); }, 1000);

// Signals

process.on('SIGINT', function () {
    console.log("\n[Server] Process ending ( SIGINT )");
    server.close();
    process.exit();
});

process.on('SIGTERM', function () {
    console.log("\n[Server] Process ending. ( SIGTERM )");
    server.close();
    process.exit();
});

// Server Start Listening
server.listen(app.get('port'), function(){
  console.log( "[Server] Running on port:" + app.get('port')+"\n[Server] Process ID: "+process.pid);
});