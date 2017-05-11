// =============================================================================
// ROUTES FOR OUR API
// They currently also need /youAppName in them. We use :appName in the routes so that you can call your app anything you want in the dev portal
// =============================================================================
const express = require('express');
const rp = require('request-promise');
const db = require('./db.js');
const config = require('../config/config.json');

// Enable the request router
const router = express.Router();
const errorHandler = function(req, res, prop) {
  if (!req.body[prop]) {
    return res.send(500, 'You must send a ' + prop + ' in the post body');
  }
};

router.options('/*', function(req, res) {
  res.send(200, 'CHECKOUT,CONNECT,COPY,DELETE,GET,HEAD,LOCK,M-SEARCH,MERGE,MKACTIVITY,MKCALENDAR,MKCOL,MOVE,NOTIFY,PATCH,POST,PROPFIND,PROPPATCH,PURGE,PUT,REPORT,SEARCH,SUBSCRIBE,TRACE,UNLOCK,UNSUBSCRIBE');
});

router.get('/test', function(req, res) {
  return res.send(200, 'Hello!');
});

router.post('/login', function(req, res) {
  errorHandler(req, res, 'username');
  errorHandler(req, res, 'password');

  const username = req.body.username;
  const password = req.body.password;
  const hubLoginToken = req.body.hubLoginToken;

  const options = {
    method: 'POST',
    uri: 'https://api.zipwhip.com/user/login',
    form: {
      username: username,
      password: password
    },
    json: true
  };

  console.log(options);

  rp(options)
    .then(function(response) {
        // save the zipwhip session for future use
        db.createUser(username, response.response, hubLoginToken);

        // ==============================
        // Post to simons java app
        // ==============================
        const hubAppOptions = {
          method: 'POST',
          uri: config.javaApp + '/login?token=' + encodeURIComponent(hubLoginToken) + '&number=' + username,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
          },
          json: true
        };

        console.log(hubAppOptions);
        rp(hubAppOptions)
          .then(function(response) {
            console.log('auth response: ', response);
            return res.send(response);
          });
    })
    .catch(function(err) {
      return res.send(500, 'Unable to log into zip whip, please check your username and password');
    });
});

router.post('/sendMessage', function(req, res) {
  errorHandler(req, res, 'from');
  errorHandler(req, res, 'to');
  errorHandler(req, res, 'message');

  const from = req.body.from;
  const to = req.body.to;
  const message = req.body.message;

  db.getUser(from).then(function(user) {
    const options = {
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
      .then(function(response) {
          db.createMessage(from, to, message);
          return res.send(200);
      })
      .catch(function(err) {
        return res.send(500, err);
      });
  });
});

// Install the webhook in order to receive it
router.post('/createWebhook', function(req, res) {
  errorHandler(req, res, 'url');

  const url = req.body.url;
  const username = req.body.username;

  db.getUser(username).then(function(user) {
    const options = {
      method: 'POST',
      uri: 'https://api.zipwhip.com/webhook/add',
      form: {
        session: user[0].session,
        type: 'message',
        event: 'receive',
        url: url,
        method: 'POST'
      },
      json: true
    };

    rp(options)
      .then(function(response) {
          return res.send(200);
      })
      .catch(function(err) {
        return res.send(500, err);
      });
  });
});

// Get the number of messages for a user to all other users that are unread
router.get('/getCountForUser', function(req, res) {
  const username = req.query.number;

  db.getUnreadForUser(username).then(function(count) {
    return res.send(200, {count: count});
  });
});

// Get the messages between two users
router.get('/getMessages', function(req, res) {
  const from = req.query.from;
  const to = req.query.to;

  db.getMessages(from, to).then(function(messages) {
    return res.send(200, messages);
  });
});

// create a contact for a user
router.post('/contact', function(req, res) {
  errorHandler(req, res, 'firstName');
  errorHandler(req, res, 'lastName');
  errorHandler(req, res, 'phoneNumber');
  errorHandler(req, res, 'username');

  db.createContact(req.body.firstName, req.body.lastName, req.body.avatar, req.body.phoneNumber, req.body.username);
  return res.send(200);
});

// get all the contacts for a user
router.get('/contacts', function(req, res) {
  db.getContacts(req.query.username).then(function(contacts) {
    return res.send(200, contacts);
  });
});

// Only used for testing
router.post('/zipwhip/api/receive', function(req, res) {
  console.log(req.body);
  return res.send(200, req.body.body);
});


module.exports = router;
