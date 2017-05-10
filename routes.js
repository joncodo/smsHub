// =============================================================================
// ROUTES FOR OUR API
// They currently also need /youAppName in them. We use :appName in the routes so that you can call your app anything you want in the dev portal
// =============================================================================

var rp = require('request-promise');
var db = require('./db.js');
var express = require('express');

// Enable the request router
var router = express.Router();
var errorHandler = function(req, res, prop) {
  if(!req.body[prop]){
    return res.send(500, 'You must send a ' + prop + ' in the post body')
  }
}

router.options('/*', function(req, res) {
  res.send(200, 'CHECKOUT,CONNECT,COPY,DELETE,GET,HEAD,LOCK,M-SEARCH,MERGE,MKACTIVITY,MKCALENDAR,MKCOL,MOVE,NOTIFY,PATCH,POST,PROPFIND,PROPPATCH,PURGE,PUT,REPORT,SEARCH,SUBSCRIBE,TRACE,UNLOCK,UNSUBSCRIBE');
});

router.get('/test', function(req, res) {
  return res.send(200, 'Hello!');
});

router.post('/login', function(req, res) {
  errorHandler(req, res, 'username');
  errorHandler(req, res, 'password');

  var username = req.body.username;
  var password = req.body.password;
  var hubLoginToken = req.body.hubLoginToken;

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
        db.createUser(username, response.response, hubLoginToken);

        // ==============================
        // Post to simons java app
        // ==============================
        var hubAppOptions = {
          method: 'POST',
          uri: 'https://tranquil-refuge-57483.herokuapp.com/',
          body: {
            token: hubLoginToken
          },
          json: true
        };
        rp(hubAppOptions)
          .then(function (response) {
            return res.send(200);
          });
    })
    .catch(function (err) {
      return res.send(500, err);
    });
});

router.post('/sendMessage', function(req, res) {
  errorHandler(req, res, 'from');
  errorHandler(req, res, 'to');
  errorHandler(req, res, 'message');

  var from = req.body.from;
  var to = req.body.to;
  var message = req.body.message;

  db.getUser(from).then(function(user) {
    var options = {
      method: 'POST',
      uri: 'https://api.zipwhip.com/message/send',
      form: {
        session: user[0].session,
        contacts: to,
        body: message
      },
      json: true
    };

    rp(options)
      .then(function (response) {
          db.createMessage(from, to, message);
          return res.send(200);
      })
      .catch(function (err) {
        return res.send(500, err);
      });
  })
});

//Install the webhook in order to receive it
router.post('/createWebhook', function(req, res) {
  errorHandler(req, res, 'url');

  var url = req.body.url;

  var options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/webhook/add',
    form: {
      session: session.key,
      type: 'message',
      event: 'receive',
      url: url,
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

// Get the number of messages for a user to all other users that are unread
router.get('/getCountForUser', function(req, res) {
  var hubloginToken = req.query.token;
  //TODO hack
  return res.send(200, {count: 11});

  db.getUnreadForUser(hubloginToken).then(function(count) {
    return res.send(200, {count: count});
  });
});

// Get the messages between two users
router.get('/getMessages', function(req, res) {
  var from = req.query.from;
  var to = req.query.to;

  db.getMessages(from, to).then(function(messages) {
    return res.send(200, messages);
  });
});

// Only used for testing
router.post('/zipwhip/api/receive', function(req, res) {
  console.log(req.body);
  return res.send(200, req.body.body);
});



module.exports = router;
