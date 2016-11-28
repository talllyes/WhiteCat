app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
     .when('/Index', {
         templateUrl: 'PickRole/Index',
         controller: 'Index as Index'
     })
     .when('/Role/:type', {
         templateUrl: 'PickRole/Role',
         controller: 'Role as Role'
     })
    .otherwise({
        redirectTo: '/Index'
    });
});
