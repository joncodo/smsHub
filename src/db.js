const MongoClient = require('mongodb').MongoClient;

const URL = require('../config/config.json').dbUrl;

module.exports = {
  createContact: function(firstName, lastName, avatar, phoneNumber, username) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return;

      const collection = db.collection('contact');
      collection.insert({
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
        phoneNumber: phoneNumber,
        username: username
      }, function(err, result) {
        if (err) console.log(err);
        db.close();
      });
    });
  },

  getContacts: function(username) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(URL, function(err, db) {
        if (err) return;

        const collection = db.collection('contact');
        collection.find({username: username}).toArray(function(err, result) {
          if (err) console.log(err.message);
          db.close();
          resolve(result);
        });
      });
    });
  },

  createMessage: function(from, to, message) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return;

      const collection = db.collection('message');
      collection.insert({
        from: from,
        to: to,
        message: message,
        isRead: false,
        createdAt: new Date()
      }, function(err, result) {
        if (err) console.log(err);
        db.close();
      });
    });
  },

  getMessages: function(from, to) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(URL, function(err, db) {
        if (err) return;

        const collection = db.collection('message');
        collection.find({from: from, to: to}).toArray(function(err, result) {
          if (err) console.log(err.message);
          db.close();
          resolve(result);
        });
      });
    });
  },

  getUnreadForUser: function(hubLoginToken) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(URL, function(err, db) {
        if (err) return;

        const collection = db.collection('user');
        collection.find({hubLoginToken: hubLoginToken}).toArray(function(err, users) {
          if (users.length < 1) {
            return 0;
          }
          const username = users[0].username;

          const collection = db.collection('message');
          collection.find({from: username, isRead: false}).toArray(function(err, result) {
            if (err) console.log(err.message);
            db.close();
            resolve(result.length);
          });
        });
      });
    });
  },

  createUser: function(username, session, hubLoginToken) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return;

      const collection = db.collection('user');
      collection.insert({
        username: username,
        session: session,
        hubLoginToken: hubLoginToken,
        createdAt: new Date()
      }, function(err, result) {
        if (err) console.log(err.message);
        db.close();
      });
    });
  },

  getUser: function(username) {
    console.log('getUserCalled');
    return new Promise(function(resolve, reject) {
      MongoClient.connect(URL, function(err, db) {
        if (err) return;

        const collection = db.collection('user');
        collection.find({username: username}).toArray(function(err, result) {
          if (err) console.log(err.message);
          db.close();
          resolve(result);
        });
      });
    });
  }
};
