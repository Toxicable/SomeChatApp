"use strict";
var App = angular.module("App", ['ngRoute', 'ngMaterial', 'ngMdIcons'])
.config(function ($routeProvider, $locationProvider, $mdThemingProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');

    $routeProvider.when('/Home',
        {
            templateUrl: 'App/html/templates/Home.html',
            controller: 'homeController',
            title: 'Time Feed'
        }
    );


    $locationProvider.html5Mode(true);

    $routeProvider.otherwise({ redirectTo: '/Home' });
});


App.directive('scroll', ['$timeout', function ($timeout) {
    return {
        scope: {
            ngScrollBottom: "="
        },
        link: function ($scope, $element) {
            $scope.$watchCollection('scroll', function (newValue) {
                if (newValue) {
                    $timeout(function () {
                        $element.scrollTop($element[0].scrollHeight);
                    }, 0);
                }
            });
        }
    }
}]);