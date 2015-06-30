var fs = require('fs');
var generateModel = require('./generate_model');
var config = require('./config');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/aidb';

function getBestGameIds(cb) {
  MongoClient.connect(mongoUrl, function(err, db){
    if (err){
      console.log(err);
      db.close();
      return;
    }
    db.collection('games').find().sort({duration: -1}).limit(10).toArray(function(err, games){
      db.close();
      if (typeof cb === 'function') {
        cb(games.map(function(game) {
          return game.gameId;
      }));
      }
    });
  });
}

function getTickData(gameIds, cb) {
  MongoClient.connect(mongoUrl, function(err, db){
    if (err){
      console.log(err);
      db.close();
      return;
    }
    db.collection('ticks').find({gameId: {$in: gameIds}}).toArray(function(err, ticks){
      db.close();
      if (typeof cb === 'function') {
        cb(ticks);
      }
    });
  });
}

function getClosestDeadly(deadlies) {
  var closest = deadlies[0];
  for (var i = 0, len = deadlies.length; i < len; i++) {
    if (closest && closest.d > deadlies[i].d) {
      closest = deadlies[i];
    }
  }
  return closest;
}

function getModelData(tickData) {
  var points = [];
  for (var i in tickData) {
    var closest = getClosestDeadly(tickData[i].deadlies);
    points.push([closest.t, closest.d, tickData[i].classification]);
  }
  return points;
}

function pointWithinCircle(point, center, radius) {
  var sum = 0;
  for (var i = 0, len = center.length; i < len; i++) {
    sum += Math.pow(point[i] - center[i], 2);
  }
  return Math.sqrt(sum) < radius;
}

var defaultRadius = 10;
function getClassificationForPoint1(modelData, point) {
  var r = defaultRadius;
  var classCounts = modelData.reduce(function (counts, dataPoint) {
    if (pointWithinCircle(dataPoint, point, r)) {
      var c = dataPoint[dataPoint.length - 1];
      counts[c] = (counts[c] || 0) + 1;
    }
    return counts;
  }, []);
  return classCounts.reduce(function (cls, currCount, currCls, arr) {
    return currCount > (arr[cls] || 0) ? currCls : cls;
  }, 0);
}

getBestGameIds( function (gameIds) {
  getTickData(gameIds, function(ticks) {
    getModelData(ticks);
    var classFn = (function (modelData) {
      return function (point) {
        return getClassificationForPoint1(modelData, point);
      };
    })(getModelData(ticks), ticks);

     fs.writeFile('public/models/' + (new Date()).getTime() + '.json', JSON.stringify({
        config: config,
        model: generateModel(config, classFn)
      }));
  });
});
