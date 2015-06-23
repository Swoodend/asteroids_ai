var fs = require('fs');

// model is a multidimensional array of classifications
// use json to stringify the model
// write that string to the file, models/0.json

var model = [];

var config = {
  dimensions: [{
    name: 'angleToNearestAsteroid',
    min: -180,
    max: 180,
    stepSize: 10
  }, {
    name: 'distanceToNearestAsteroid',
    min: 0,
    max: 500,
    stepSize: 10
  }]
};
