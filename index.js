var express = require('express');
var wagner = require('wagner-core');
require('./models/db.js')(wagner);
//require('./dependencies')(wagner);

var app = express();

//wagner.invoke(require('./auth'), { app: app });
app.use('/asset',require('./apis/asset_api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');