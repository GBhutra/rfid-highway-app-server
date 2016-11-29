var AssetC = require('./controller/assetController');
var LogC = require('./controller/logController');

var asset =  {data : {signText:"YIELD", location:"MAIN CAMPUS"}, tag : {epcVal:"12350"}};


//AssetC.create(asset,function(err) {
//    if (!err)
//        console.log("asset created !! ");
//    else
//        console.log("Error:"+err);
//});

AssetC.findWithEPC({epcVal:"12350"},function(error,asset) {
    console.log("Asset Found ");
    LogC.create({assetID:asset._id, tag : {epcVal:"12350"}},function(err){
        if (!err)
            console.log("Log created !! ");
        else
            console.log("Error:"+err);
    });
});


