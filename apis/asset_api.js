var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
  var api = express.Router();
  api.use(bodyparser.json());
  
  api.get('/',wagner.invoke(function(Asset) {
    return function(req,res)  {
      Asset.find({},function(err,assets) {
        if (err)
          res.json(err)
        else
          res.json(assets);
      });
    }
  }));
  return api;
};