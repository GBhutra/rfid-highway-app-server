var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
  var assetRouter = express.Router();
  assetRouter.use(bodyparser.json());
  
  assetRouter.get('/assets',wagner.invoke(function(Asset,User) {
    return function(req,res)  {
      if (!req.user) {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.user._id)
          .exec(function(err,usr){
            if(err)
              return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            else if(null==usr)
              return res.status(status.UNAUTHORIZED).json({ error: 'Invalid UserID!!' });
          });
        Asset.find({},function(err,assets) {
          if (err)
            res.json(err)
          else
            res.json(assets);
        });
      }
    }
  }));
  return assetRouter;
};