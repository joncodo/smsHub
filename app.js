var fs = require('fs');
var express = require('express');
var app = express();
var rp = require('request-promise');
var cookieParser = require('cookie-parser')

// =============================================================================
// Express app configuration
// =============================================================================

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

// =============================================================================
// ROUTES FOR OUR API
// They currently also need /youAppName in them. We use :appName in the routes so that you can call your app anything you want in the dev portal
// =============================================================================

var rp = require('request-promise');
var db = require('./db.js');

router.get('/login', function(req, res) {
  console.log('test route called');
  var username = '8445971754';
  var password = 'broadsoft123';

  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/user/login',
    form: {
      username: username,
      password: password
    },
    json: true
  };

  rp(options)
    .then(function (response) {
        // save the zipwhip session for future use
        db.createUser(username, response.response, undefined);
        return res.send(200);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
});

router.post('/sendMessage/:number', function(req, res) {
  var username = req.body.from;
  var number = req.body.to;
  var message = req.body.message;

  db.getUser(username).then(function(user) {
    var options = {
      method: 'POST',
      uri: 'https://api.zipwhip.com/message/send',
      form: {
        session: user[0].session,
        contacts: number,
        body: message
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
  })
});

//Install the webhook in order to receive it
router.get('/createWebhook?url=https://young-basin-29738.herokuapp.com/zipwhip/api/receive', function(req, res) {
  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/webhook/add',
    form: {
      session: session.key,
      type: 'message',
      event: 'receive',
      url: req.query.url,
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

//Install the webhook in order to receive it
router.get('/getCountForUser', function(req, res) {
  return res.send(200, {count: '11'});
});

router.post('/zipwhip/api/receive', function(req, res) {
  console.log(req.body);
  return res.send(200, req.body.body);
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
