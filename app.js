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
  "origin": "*",
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

router.get('/login', function(req, res) {
  console.log('test route called');
  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/user/login',
    form: {
      username: '8445971754',
      password: 'broadsoft123'
    },
    json: true
  };

  rp(options)
    .then(function (response) {
        console.log('output body', response.response);
        session.key = response.response;
        return res.send(response.response);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
});

router.post('/sendMessage/:number', function(req, res) {
  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/message/send',
    form: {
      session: session.key,
      contacts: req.params.number,
      body: req.body.message
    },
    json: true
  };

  rp(options)
    .then(function (response) {
        return res.send(200);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
});

//Install the webhook in order to receive it
router.get('/createWebhook', function(req, res) {
  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/webhook/add',
    form: {
      session: session.key,
      type: 'message',
      event: 'receive',
      url: 'https://young-basin-29738.herokuapp.com/zipwhip/api/receive',
      method: 'POST'
    },
    json: true
  };

  rp(options)
    .then(function (response) {
        return res.send(200);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
});

router.post('/zipwhip/api/receive', function(req, res) {
  console.log(req.body);
  return res.send(200);
});

// curl -X POST https://api.zipwhip.com/webhook/add \
//        -d session=[sessionKey] \
//        -d type=message \
//        -d event=receive \
//        -d url=https://test.zipwhip.com/message/receive \
//        -d method=POST



// =============================================================================
// REGISTER OUR ROUTES -------------------------------
// =============================================================================
app.use(router);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
