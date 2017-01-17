'use strict';
/**
 * @ngdoc overview
 * @name rfidLabAdminApp
 * @description
 * # An Application for admin tasks in the RFID-Lab
 *
 * Main module of the application.
 */

var rfidLabAdminApp =  angular.module('rfidLabAdminApp', ['oc.lazyLoad','ui.router','ui.bootstrap','angular-loading-bar']);

rfidLabAdminApp.config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });
    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('welome', {
        url:'/welcome',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'rfidLabAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
    .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'rfidLabAdminApp',
              files:[
                'scripts/controllers/main.js',
                'scripts/directives/timeline/timeline.js',
                'scripts/directives/notifications/notifications.js',
                'scripts/directives/chat/chat.js',
                'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
    })
    .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login',
        authenticate : false
    })
    .state('dashboard.main',{
      templateUrl:'views/pages/main.html',
      url:'/main',
      authenticate : true
    })
    .state('dashboard.users',{
      templateUrl:'views/pages/users.html',
      url:'/users',
      authenticate : true
    })
    .state('dashboard.user',{
      templateUrl:'views/pages/user.html',
      url:'/user',
      authenticate : true
    })
 }]);

rfidLabAdminApp.run(['$rootScope', '$state', '$stateParams','authService',
    function($rootScope, $state, $stateParams, authService) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        if (toState.authenticate && !authService.isLoggedIn())
            event.preventDefault();
            $state.go('login');
      });
    }
  ]);
