app.controller('Index', function ($rootScope, $scope, $http, $routeParams) {
    var Index = this;
    Index.sence = [];
    Index.today = new Date;
    $("#change1").loadchange("on", 1000);
    function getScene() {
        $http({
            method: 'POST',
            url: '../WebAPI/Index.ashx?type=getSence'
        }).then(function successCallback(response) {
            if (response.data != "無效的指令") {
                Index.sence = response.data;
                $("#change1").loadchange("off")
            } else {
                alert("連線失敗，免費空間不穩定請重整或稍後再試。");
            }
        }, function errorCallback(response) {
            alert("連線失敗，免費空間不穩定請重整或稍後再試");
        });
    }
    getScene();

    Index.chooseSence = function (id) {
        location.href = "#/Role/" + id;
    }

});

