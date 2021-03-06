var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');


module.exports = function(wagner) {
  var dashboardRouter = express.Router();
  dashboardRouter.use(bodyparser.json());

  dashboardRouter.get('/profile',wagner.invoke(function(Asset,User,Log) {
    return function(req,res)  {
      if (!req.payload._id)  {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.payload._id)
          .exec(function(err,usr){
            if(err)
              return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            else if(null===usr)
              return res.status(status.UNAUTHORIZED).json({ error: 'Invalid UserID!!' });
            else {
              res.status(status.OK).json(usr);
            }
          });
      }
    }
  }));

  dashboardRouter.get('/',wagner.invoke(function(Asset,User,Log) {
    return function(req,res)  {
      if (!req.payload._id) {
        res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
      } else {
        User
          .findById(req.payload._id)
          .exec(function(err,usr){
            if(err)
              return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            else if(null===usr)
              return res.status(status.UNAUTHORIZED).json({ error: 'Invalid UserID!!' });
            else {
              var dashBoard;
              Asset.count({},function(err,nAssets) {
                User.count({},function(err,nUsers)  {
                  Log.count({},function(err,nLogs){
                    if (err)
                      res.json(err);
                    else  {
                        dashBoard.nAssets = nAssets;
                        dashBoard.nUsers = nUsers;
                        dashBoard.nLogs = nLogs;
                        res.json(dashBoard);
                    }
                  });
                });
              });
            }
          });
      }
    }
  }));

  return dashboardRouter;
}
