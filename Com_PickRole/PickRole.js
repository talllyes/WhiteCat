var app = angular.module('PickRoleApp', ['ngRoute', 'ngSanitize']);
app.controller('PickRole', function ($rootScope, $scope, $http, $timeout) {
    var PickRole = this;
    PickRole.today = new Date();



    $(function () {
        var topOffset = 154;
        var height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#fh").css("min-height", (height) + "px");
        }
    });

});
