var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/aidb';


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
    var ticks = db.collection('ticks');
    socket.on('save tick', function(data){
      ticks.insert(data);
    });
    var games = db.collection('games');
    socket.on('save game', function(data){
      games.insert(data);
    });
    socket.on('update game', function(data){
      games.findOneAndUpdate(
        {gameId: data.gameId},
        data,
        {upsert: true}
        );
    });
    socket.on('disconnect', function(){
      db.close();
    });
  });
});

