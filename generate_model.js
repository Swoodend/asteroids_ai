var fs = require('fs');

var gameData = JSON.parse(fs.readFileSync('games.json'));
var tickData = JSON.parse(fs.readFileSync('ticks.json'));

function getGameIds(gameData) {
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

