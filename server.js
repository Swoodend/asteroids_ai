var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27020/test';
var gameStates = db.collection('game_states');

var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.listen(process.env.PORT || 3000);

app.post('/data/save', function(req, res){
  console.log(req);

  
  // col.insertOne(obj, function(err, r){
  //   test.equal(null, err);
  //   test.equal(2, r.insertedCount);
  //   db.close();
  
  // })
})
