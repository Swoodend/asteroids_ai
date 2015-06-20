var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/test';


var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.static('bower_components'));
http.listen(process.env.PORT || 3000);


io.on('connection', function(socket){
  MongoClient.connect(mongoUrl, function(err, db){
    if (err){
      console.log(err);
      return;
    }
    var gameStates = db.collection('game_states');
    socket.on('save data', function(data){
      gameStates.insert(data);
    })
    socket.on('disconnect', function(){
      db.close();
    })  
  })
})

