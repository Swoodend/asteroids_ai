function generateModel(listOfDims, classFn, pos, depth) {
  pos = pos || [];
  depth = depth || 0;
  var dim = listOfDims[0];
  var res = [];
  for (var i = dim.min; i <= dim.max; i+= dim.stepSize) {
    pos[depth] = i;
    if (listOfDims.length > 1) {
      res.push(generateModel(listOfDims.slice(1), classFn, pos, depth + 1));
    } else {
      res.push(classFn(pos));
    }
  }
  return res;
}

module.exports = generateModel;
