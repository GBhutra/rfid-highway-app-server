var mongoose = require('mongoose');
var User = require('./user.js');

var signSchema = new mongoose.Schema({
  rfidTagId: { 
    type: String, 
    required: true,
    unique: true
  },
  //signText: { type: String, required: true},
  //signType: {type: String, required: true},
  //latitude: {type: Number, required: true},
  //longitude: {type: Number, required: true},
  //group: {type: String, required: true},
  //image: { type: String, match: /^http:\/\//i },
  //address: {type: String},
  //dateAdded: {type: Date},
  addedBy: {
    type: String,
    match: /.+@.+\..+/,
    lowercase: true 
  },
});

mongoose.model('Sign', signSchema);