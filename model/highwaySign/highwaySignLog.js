var mongoose = require('mongoose');

var highwaySignLogSchema = {
    loc : {type:String}
};

module.exports = new mongoose.Schema(highwaySignLogSchema);
module.exports.highwaySignSchema = highwaySignLogSchema;
