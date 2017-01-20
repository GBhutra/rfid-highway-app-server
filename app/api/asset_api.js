var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');


module.exports = function(wagner) {
  var assetRouter = express.Router();
  assetRouter.use(bodyparser.json());

  assetRouter.get('/assets',wagner.invoke(function(Asset,User) {
    return function(req,res)  {
      if (!req.payload._id) {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.payload._id)
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

  assetRouter.get('/assets/:loc',wagner.invoke(function(Asset,User) {
    return function(req,res)  {
      if (!req.payload._id) {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.payload._id)
          .exec(function(err,usr){
            if(err)
              return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            else if(null==usr)
              return res.status(status.UNAUTHORIZED).json({ error: 'Invalid UserID!!' });
          });
        Asset.find({})
         .where('data.location')
         .equals('Riverside')
         .exec(function(err,assets) {
          if (err)
            res.json(err)
          else
            res.json(assets);
        });
      }
    }
  }));

  assetRouter.post('/assets/asset',wagner.invoke(function(Asset,User) {
    return function(req,res)  {
      if (!req.payload._id) {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.payload._id)
          .exec(function(err,usr){
            if(err)
              return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            else if(null==usr)
              return res.status(status.UNAUTHORIZED).json({ error: 'Invalid UserID!!' });
          });
        var asset = new Asset();
        asset.data = req.body.data;
        asset.tag = req.body.tag;
        asset.save(function(err,as){
          if (err)
            res.json(err);
          else
            res.json("New Asset Created with epcVal: "+as.tag.epcVal);
        });
      }
    }
  }));

  assetRouter.put('/assets/asset/:epcVal',wagner.invoke(function(Asset,User) {
    return function(req,res)  {
      if (!req.payload._id) {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.payload._id)
          .exec(function(err,usr){
            if(err)
              return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            else if(null==usr)
              return res.status(status.UNAUTHORIZED).json({ error: 'Invalid UserID!!' });
          });
          Asset.findOne({'tag.epcVal':req.params.epcVal},function(error,doc) {
            doc.data = req.body.data;
            doc.tag = req.body.tag;
            doc.save(function(err){
              if (err)
                res.json(err);
              else
                res.json("Asset wit epcVal: "+docs.tag.epcVal+" successfully Updated!");
            });
        });
      }
    }
  }));

  return assetRouter;
};
