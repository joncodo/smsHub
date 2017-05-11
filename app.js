// =============================================================================
// Express app configuration and starting
// =============================================================================

var fs = require('fs');
var express = require('express');
var app = express();
var rp = require('request-promise');
var cors = require('cors');


// If you are doing REST apis, you will need the body-parser to parse response bodies
var bodyParser = require('body-parser');

// You will need to enable cors in order to receive request from our servers
app.use(cors({
  "origin": ["https://tranquil-refuge-57483.herokuapp.com", "https://zipwhip-frontend.herokuapp.com", "https://core.broadsoftlabs.com"],
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "credentials": true
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//8080 is the default port for heroku but you can use any port you wish
var port = process.env.PORT || 8080;

var routes = require('./routes.js');
app.use(routes);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
