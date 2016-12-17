var directives = require('./directives');
var _ = require('underscore');

var components = angular.module('rfid-lab.components', ['ng']);

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

var app = angular.module('rfid-lab', ['rfid-lab.components', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
  when('/', {
      templateUrl: 'templates/frontpage.html'
    }).
    when('/login', {
      templateUrl: 'templates/login.html'
    });
});

