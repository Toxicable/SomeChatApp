"use strict";
App.controller('homeController', ['$scope', '$http', '$mdDialog',
function homeController($scope, $http, $mdDialog) {

    $scope.message = ""
    $scope.username = ""
    $scope.messageBoard = []
    $scope.users = []
    $scope.playAlert = false

    //var newMessage = new Audio("App/content/SmokeWeekEveryDay.mp3")
    var hub = $.connection.chatHub;

    $scope.sendMessage = function () {
        hub.server.broadcastMessage($scope.message)
        $scope.message = ""
    }

    hub.client.broadcastMessage = function (message) {
        $scope.messageBoard.push(message)
        var element = document.getElementById('messageBoard')
        element.scrollTop = element.scrollHeight
        $scope.$apply()
        //if ($scope.playAlert) {
        //    newMessage.play()
        //}
    }

    hub.client.userDisconnected = function (user) {
        for (var i = 0; i < $scope.users.length; i++)
            if ($scope.users[i].Username === user.Username) {
                $scope.users.splice(i, 1);
                break;
            };
        var message = { Sender: "Server", Content: user.Username + " has disconnected" };
        $scope.messageBoard.push(message)
        $scope.$apply()
    }

    hub.client.userConnected = function (user) {
        $scope.users.push(user);
        var message = { Sender: "Server", Content: user.Username + " has connected" }
        $scope.messageBoard.push(message)
        $scope.$apply()
    }

    hub.client.sendUsers = function (users){
        $scope.users = users
    }

    hub.client.checkUsernameAvilabilityResult = function (result) {
        console.log(result)
        if (result) {
            hub.server.onChatConnection($scope.enteredUsername)
            $mdDialog.hide();
            $scope.username = $scope.enteredUsername;
        }else {
            $scope.errourusName = $scope.enteredUsername;
            $scope.takenUsername = true
        }
    }

    $scope.closeDialog = function () {
        hub.server.checkUsernameAvilability($scope.enteredUsername)
    }

    $.connection.hub.logging = false;
    $.connection.hub.start();

    $mdDialog.show({
        clickOutsideToClose: false,
        templateUrl: 'App/html/templates/UsernameDialog.html',
        controller: function DialogController () { },
        scope: $scope,        // use parent scope in template
        preserveScope: true,  // do not forget this if use parent scope
    });
}]);