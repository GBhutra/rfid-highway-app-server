var fs = require('fs');
module.exports = function(wagner) {
  var config = JSON.parse(fs.readFileSync('./app/config/config.json').toString());
  wagner.factory('Config', function() {
    return config;
  });
  return config;
};