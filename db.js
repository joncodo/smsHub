var MongoClient = require('mongodb').MongoClient

var URL = 'mongodb://localhost:27017/mydatabase'

module.exports = {
  createMessage: function(text) {

  }
}

MongoClient.connect(URL, function(err, db) {
  if (err) return

  var collection = db.collection('message')
  collection.insert({
    phoneNumber: '555555',
    createdAt: new Date(),
    text: 'This is sample text'
  }, function(err, result) {
    collection.find({name: 'taco'}).toArray(function(err, docs) {
      console.log(docs[0])
      db.close()
    })
  })
})
