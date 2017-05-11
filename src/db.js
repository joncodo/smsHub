const MongoClient = require('mongodb').MongoClient;

const config = require('../config/config.json');

module.exports = {
  createContact: function(firstName, lastName, avatar, phoneNumber, username) {
    MongoClient.connect(config.dbconfig.dbUrl, function(err, db) {
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
      MongoClient.connect(config.dbUrl, function(err, db) {
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
    MongoClient.connect(config.dbUrl, function(err, db) {
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
      MongoClient.connect(config.dbUrl, function(err, db) {
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

  getUnreadForUser: function(username) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(config.dbUrl, function(err, db) {
        if (err) return;

        const collection = db.collection('message');
        collection.find({from: username, isRead: false}).toArray(function(err, result) {
          if (err) console.log(err.message);
          db.close();
          resolve(result);
        });
      });
    });
  },

  createUser: function(username, session, hubLoginToken) {
    MongoClient.connect(config.dbUrl, function(err, db) {
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
      MongoClient.connect(config.dbUrl, function(err, db) {
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
