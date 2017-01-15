'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('rfidLabAdminApp')
	.directive('chat',function(){
		return {
        templateUrl:'scripts/directives/chat/chat.html',
        restrict: 'E',
        replace: true,
    	}
	});


