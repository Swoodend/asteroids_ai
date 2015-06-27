var fs = require('fs');
var generateModel = require('./generate_model');
var config = require('./config');

var gameData = JSON.parse(fs.readFileSync('games.json'));
var tickData = JSON.parse(fs.readFileSync('ticks.json'));

function getBestGameIds(gameData) {
  var gameIds = [];
  var sorted = gameData.sort(function(a, b) {
    return a.totalPoints - b.totalPoints;
  });
  sorted = sorted.slice(5);
  for (var i in sorted) {
    gameIds.push(sorted[i].gameId);
  }
  return gameIds;
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

function getModelData(gameIds) {
  var points = [];
  for (var i in tickData) {
    if (gameIds.indexOf(tickData[i].gameId) != -1) {
      var closest = getClosestDeadly(tickData[i].deadlies);
      points.push([closest.d, closest.t, tickData[i].classification]);
    }
  }
  return points;
}

function getClassificationForPoint1(point) {
  return 0;
}

fs.writeFile('public/models/' + (new Date()).getTime() + '.json', JSON.stringify({
  config: config,
  model: generateModel(config, getClassificationForPoint1)
}));
