var app = angular.module('PickRoleApp', ['ngRoute', 'ngSanitize']);
app.controller('PickRole', function ($rootScope, $scope, $http, $timeout) {
    var PickRole = this;
    PickRole.today = new Date();
});
