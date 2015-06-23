var fs = require('fs');

// model is a multidimensional array of classifications
// use json to stringify the model
// write that string to the file, models/0.json


var config = [{
    name: 'angleToNearestAsteroid',
    min: -180,
    max: 180,
    stepSize: 10
  }, {
    name: 'distanceToNearestAsteroid',
    min: 0,
    max: 500,
    stepSize: 10
  }];

function generateModel(listOfDims) {
  var dim = listOfDims[0];
  var res = [];
  for (var i = dim.min; i < dim.max; i+= dim.stepSize) {
    if (listOfDims.length > 1) {
      res.push(generateModel(listOfDims.slice(1)));
    } else {
      res.push(0);
    }
  }
  return res;
}

var model = generateModel(config);

fs.writeFile('models/0.json', JSON.stringify(model));
