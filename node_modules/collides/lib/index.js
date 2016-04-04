let Utils = require('utils');

module.exports = function(a, b) {
  a = Utils.parse(a);
  b = Utils.parse(b);
  return Utils.intersect(a, b) && Utils.intersect(b, a);
};
