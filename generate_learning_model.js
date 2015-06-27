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

function getModelData(gameIds, tickData) {
  var points = [];
  for (var i in tickData) {
    if (gameIds.indexOf(tickData[i].gameId) != -1) {
      var closest = getClosestDeadly(tickData[i].deadlies);
      points.push([closest.t, closest.d, tickData[i].classification]);
    }
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

var classFn = (function (modelData) {
  return function (point) {
    return getClassificationForPoint1(modelData, point);
  };
})(getModelData(getBestGameIds(gameData), tickData));

fs.writeFile('public/models/' + (new Date()).getTime() + '.json', JSON.stringify({
  config: config,
  model: generateModel(config, classFn)
}));
