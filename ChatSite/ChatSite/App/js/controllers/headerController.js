"use strict";
App.controller('headerController',
    function headerController($scope, $location) {

        $scope.changeView = function (view) {
            $location.path(view); // path not hash
        }

        $scope.isActive = function (viewLocation) {
            //console.log(viewLocation)
            return viewLocation === $location.path();
        };

        //$scope.isContains = function (viewLocation) {
        //    //console.log(viewLocation)
        //    return  $location.path().indexOf(viewLocation) !== -1;
        //};

    });