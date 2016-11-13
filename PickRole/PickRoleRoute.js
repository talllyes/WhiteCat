app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
     .when('/Role', {
         templateUrl: 'Role/Role.html',
         controller: 'Role as Role'
     })
    .otherwise({
        redirectTo: '/Role'
    });
});
