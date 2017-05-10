var MongoClient = require('mongodb').MongoClient

var URL = require('./config.json').dbUrl;

module.exports = {
  createMessage: function(text) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return

      var collection = db.collection('message')
      collection.insert({
        phoneNumber: '555555',
        text: 'This is sample text',
        createdAt: new Date()
      }, function(err, result) {
        if (err) console.log(err);
        db.close()
      })
    })
  },

  createUser: function(username, session, hubLoginToken) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return

      var collection = db.collection('user')
      collection.insert({
        username: username,
        session: session,
        hubLoginToken: hubLoginToken,
        createdAt: new Date()
      }, function(err, result) {
        if (err) console.log(err.message);
        db.close()
      })
    })
  },

  getUser: function(username) {
    console.log('getUserCalled');
    return new Promise(function(resolve, reject) {
      MongoClient.connect(URL, function(err, db) {
        if (err) return

        var collection = db.collection('user')
        collection.find({username: username}).toArray(function(err, result) {
          if (err) console.log(err.message);
          db.close()
          resolve(result);
        });
      });
    });
  }
}
