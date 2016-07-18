var imports = require('./imports');
//============================
var express = imports.getExpress();
//============================

var env = express();
var port = (process.env.PORT || 5000);

env.set('port',port);
env.use('/', express.static('./public'));



module.exports = env;