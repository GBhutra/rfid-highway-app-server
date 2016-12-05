var express = require('express');
module.exports = function() {
    var app = express();
    
    app.get('/', function(req,res)  {
        res.send('Hello World');
    });

    app.get('/asset/:assetID', function(req,res)  {
        res.send('Asset Page');
    });

    app.get('/log/:logID', function(req,res)  {
        res.send('Log Page');
    });

    app.get('/log/:location', function(req,res)  {
        res.send('Report Page for a sepcific location');
    });

    app.post('/asset/create/:asset', function(req,res)  {
        res.send('Asset Creation Page');
    });

    app.post('/log/create/:log', function(req,res)  {
        res.send('Log Creation Page');
    });
    
    return app;
}