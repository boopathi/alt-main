var B = require('../B');
var C = require('../C');
var D = require('../D');

module.exports = function() {
  return [D(), C(), B(), 'A'];
};
