var fs = require('fs');

var config = [{
    name: 'angleToNearestAsteroid',
    min: 0,
    max: 359,
    stepSize: 10
  }, {
    name: 'distanceToNearestAsteroid',
    min: 0,
    max: 500,
    stepSize: 10
}];

function generateModel(listOfDims, pos, depth) {
  pos = pos || [];
  depth = depth || 0;
  var dim = listOfDims[0];
  var res = [];
  for (var i = dim.min; i < dim.max; i+= dim.stepSize) {
    pos[depth] = i;
    if (listOfDims.length > 1) {
      res.push(generateModel(listOfDims.slice(1), pos, depth + 1));
    } else {
      if (pos[0] < 90) {
        res.push(3);
      } else if (pos[0] >= 90 && pos[0] < 270) {
        res.push(4);
      } else if (pos[0] >= 270) {
        res.push(2);
      }
    }
  }
  return res;
}

var model = generateModel(config);

fs.writeFile('models/0.json', JSON.stringify(model));
