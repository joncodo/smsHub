// =============================================================================
// Express app configuration and starting
// =============================================================================

const fs = require('fs');
const express = require('express');
const app = express();
const rp = require('request-promise');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': true,
  'credentials': true
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// 8080 is the default port for heroku but you can use any port you wish
const port = process.env.PORT || 8080;

const routes = require('./src/routes.js');
app.use(routes);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
