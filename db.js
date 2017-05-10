var MongoClient = require('mongodb').MongoClient

var URL = 

module.exports = {
  createMessage: function(text) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return

      var collection = db.collection('message')
      collection.insert({
        phoneNumber: '555555',
        createdAt: new Date(),
        text: 'This is sample text'
      }, function(err, result) {
        if ()
        db.close()
      })
    })
  },

  createUser: function(username, session, hubLoginToken) {
    MongoClient.connect(URL, function(err, db) {
      if (err) return

      var collection = db.collection('message')
      collection.insert({
        phoneNumber: '555555',
        createdAt: new Date(),
        text: 'This is sample text'
      }, function(err, result) {
        if ()
        db.close()
      })
    })
  }
}
