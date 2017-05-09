var fs = require('fs');
var cors = require('cors');
var express = require('express');
var app = express();
var rp = require('request-promise');
var cookieParser = require('cookie-parser')
var session = require('express-session')

// =============================================================================
// Express app configuration
// =============================================================================

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// You will need to enable cors in order to receive request from our servers
app.use(cors({
  "origin": "https://hub-sandbox.broadsoftlabs.com:8443",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "credentials": true
}));

// If you are doing REST apis, you will need the body-parser to parse response bodies
var bodyParser = require('body-parser');

// Allow use of webpages in the public diectory
app.use('/', express.static(__dirname + '/public'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// This allows you to read and set cookies
app.use(cookieParser())

//8080 is the default port for heroku but you can use any port you wish
var port = process.env.PORT || 8080; // set our port

// Enable the request router
var router = express.Router();

// This is required to interface with the Hub api
router.options('/*', function(req, res) {
  res.send(200, 'CHECKOUT,CONNECT,COPY,DELETE,GET,HEAD,LOCK,M-SEARCH,MERGE,MKACTIVITY,MKCALENDAR,MKCOL,MOVE,NOTIFY,PATCH,POST,PROPFIND,PROPPATCH,PURGE,PUT,REPORT,SEARCH,SUBSCRIBE,TRACE,UNLOCK,UNSUBSCRIBE');
});

// =============================================================================
// ROUTES FOR OUR API
// They currently also need /youAppName in them. We use :appName in the routes so that you can call your app anything you want in the dev portal
// =============================================================================


var rp = require('request-promise');

// test route to make sure everything is working (accessed at GET http://localhost:8080/test)
router.get('/test', function(req, res) {
  console.log('test route called');
  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/user/login',
    form: {
      username: '8445971754',
      password: 'broadsoft123'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(function (response) {
        console.log('output body', response.response);
        return res.send(response.response);
    //     $ curl https://api.zipwhip.com/message/send \
    // -d session=3d0f1dde-aaff-4ce8-b61a-af212a860abc:123456789
    // -d --data-urlencode contacts='+18559479447'
    // -d --data-urlencode body='Hello World, from Zipwhip!'
    })
    .catch(function (err) {
      return res.send(500, err);

        // API call failed...
    });

// $ curl –X POST https://api.zipwhip.com/user/login \
//     -d username=[phone number] \
//     -d password=[account password]
// {
//   "success":true,
//   "response":"3d0f1dde-aaff-4ce8-b61a-af212a860abc:123456789"


});

// =============================================================================
// REGISTER OUR ROUTES -------------------------------
// =============================================================================
app.use(router);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
