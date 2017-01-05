var fs = require('fs');
module.exports = function(wagner) {
  var config={};
  if (process.env.NODE_ENV === 'production') {
    config.dbURI =process.env.MONGOLAB_URI; 
    config.secretKey=process.env.SecretKey;
  }
  else {
    config = JSON.parse(fs.readFileSync('./app/config/config.json').toString());
  }
  wagner.factory('Config', function() {
    return config;
  });
  return config;
};