var fs = require('fs');

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
  var closest;
  for (var i = 0, len = deadlies.length; i < len; i++) {
    if (closest && closest.d > deadlies[i].d) {
      closest = deadlies[i];
    } else {
      closest = deadlies[i];
    }
  }
  return closest;
}

function getTicks(gameIds) {
  for (var i in tickData) {
    if (tickData[i].gameId === 1435270780852) {
      console.log(tickData[i]);
    }
  }
}
