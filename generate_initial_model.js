var fs = require('fs');
var generateModel = require('./generate_model');
var config = require('./config');

function getClassificationForPoint0(pos) {
  if (pos[0] < 90) {
    return 3;
  }
  if (pos[0] >= 90 && pos[0] < 270) {
    return 4;
  }
  if (pos[0] >= 270) {
    return 2;
  }
  return 0;
}

fs.writeFile('public/models/0.json', JSON.stringify({
  config: config,
  model: generateModel(config, getClassificationForPoint0)
}));
