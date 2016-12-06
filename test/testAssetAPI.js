var assert = require('assert');
var express = require('express');
var fs = require('fs');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Assets',function()  {
  var server;
  var app;

  before(function() {
    app = express();
    models = require('../models/db.js')(wagner);

    var deps = wagner.invoke(function(Asset, Log, User) {
      return {
        Category: Category,
        fx: fx,
        Product: Product,
        Stripe: Stripe,
        User: User,
        Config: Config
      };
    });

    Category = deps.Category;
    Config = deps.Config;
    fx = deps.fx;
    Product = deps.Product;
    Stripe = deps.Stripe;
    User = deps.User;

    app.use(function(req, res, next) {
      User.findOne({}, function(error, user) {
        assert.ifError(error);
        req.user = user;
        next();
      });
    });

    app.use(require('./api')(wagner));

    server = app.listen(3000);
  });
});