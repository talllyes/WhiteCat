var app = angular.module('PickRoleApp', ['ngRoute', 'ngSanitize']);

app.controller('PickRole', function ($rootScope, $scope, $http, $timeout) {
    var PickRole = this;
    PickRole.starNum = {};
    PickRole.selectList = [];
    PickRole.Img = "";
    PickRole.Name = "";
    PickRole.s = "";
    PickRole.e = "";
    PickRole.SceneID = 0;
    PickRole.getScene = function () {
        $("#change1").loadchange("on");
        $http({
            method: 'POST',
            url: '../WebAPI/PickRole.ashx?type=getSence'
        }).then(function successCallback(response) {
            PickRole.selectList = response.data;
            PickRole.Img = "../Img/sence/" + PickRole.selectList[0].Src;
            PickRole.SceneID = PickRole.selectList[0].SceneID;
            PickRole.Name = PickRole.selectList[0].Name;
            PickRole.s = PickRole.selectList[0].StartDate;
            PickRole.e = PickRole.selectList[0].EndDate;
            PickRole.getSceneNum();
            if (!$rootScope.getSceneRole) {
                $timeout(PickRole.getScene, 500);
            } else {
                $rootScope.getSceneRole(PickRole.SceneID);
            }

        }, function errorCallback(response) {
            alert("連線失敗，免費空間不穩定請重整或稍後再試");
        });
    }

    PickRole.changeSence = function (id) {
        $("#change1").loadchange("on");
        var index = getSKey(id);
        PickRole.Img = "../Img/sence/" + PickRole.selectList[index].Src;
        PickRole.SceneID = PickRole.selectList[index].SceneID;
        PickRole.Name = PickRole.selectList[index].Name;
        PickRole.s = PickRole.selectList[index].StartDate;
        PickRole.e = PickRole.selectList[index].EndDate;
        PickRole.getSceneNum();
        $rootScope.getSceneRole(id);
    };

    function getSKey(id) {
        var index = 0;
        angular.forEach(PickRole.selectList, function (value, key) {
            if (value.SceneID == id) {
                index = key;
            }
        });
        return index;
    }

    PickRole.getScene();
    PickRole.getSceneNum = function () {
        var temp = {};
        temp.SceneID = PickRole.SceneID;
        $http({
            method: 'POST',
            url: '../WebAPI/Role.ashx?type=sceneNum',
            data: temp
        }).then(function successCallback(response) {
            PickRole.starNum = response.data;
        }, function errorCallback(response) {
            alert("連線失敗，免費空間不穩定請重整或稍後再試");
        });
    }

});
