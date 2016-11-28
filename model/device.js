var mongoose = require('mongoose');
var User = require('./user.js');

var deviceSchema = {
    dateAdded : {type: Date},
    belongsTo : User.userSchema
};

mongoose.model('Device', deviceSchema);