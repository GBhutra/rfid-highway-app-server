var fs = require('fs');
module.exports = function(wagner) {
  var config = {
    "dbURI":"mongodb://localhost:27017/rfidServer",
    "secretKey":"alfknmcaca[",
    "PORT":"3000"
  };
  wagner.factory('Config', function() {
    return config;
  });
  return config;
};