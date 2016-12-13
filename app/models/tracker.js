var mongoose = require( 'mongoose' );

var RFIDTagSchema = {
   epcVal : {
        type:String, 
        required: true, 
        unique: true
    }
};

module.exports = new mongoose.Schema(RFIDTagSchema);
module.exports.RFIDTagSchema = RFIDTagSchema;