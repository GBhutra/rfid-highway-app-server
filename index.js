var AssetC = require('./controller/assetController');
var LogC = require('./controller/logController');
var server = require('./server.js');

server().listen(3000);


AssetC.findWithEPC({epcVal:"12350"},function(error,asset) {
    if (null==asset)
        console.log("Asset Not found ");
    else
        console.log(asset);
});

