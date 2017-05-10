// =============================================================================
// Express app configuration and starting
// =============================================================================

var fs = require('fs');
var express = require('express');
var app = express();
var rp = require('request-promise');

// If you are doing REST apis, you will need the body-parser to parse response bodies
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//8080 is the default port for heroku but you can use any port you wish
var port = 8080;

var routes = require('./routes.js');
app.use(routes);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
