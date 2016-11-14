var app = angular.module('PickRoleApp', ['ngRoute', 'ngSanitize']);

app.controller('PickRole', function ($rootScope, $scope, $http) {
    var PickRole = this;
    PickRole.starNum = {};
    PickRole.getSceneNum=function() {
        var temp = {};
        temp.SceneID = 1;
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=sceneNum',
            data: temp
        }).then(function successCallback(response) {
            PickRole.starNum = response.data;
        }, function errorCallback(response) {
        });
    }
    PickRole.getSceneNum();


});
