var mongoose = require('mongoose');
var Device = require('./device.js');
var User = require('./user.js');
var Sign = require('./sign.js');

var reportSchema = {
  date: { type: Date, required: true },
  time: { type: Timestamp, required: true},
  sign: Sign.signSchema,
  device: Device.deviceSchema,
  addedBy: User.userSchema
};

mongoose.model('Report', reportSchema);